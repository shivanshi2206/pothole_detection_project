from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import BackgroundTasks
from pathlib import Path
import shutil
import uuid
import cv2
import numpy as np
from ultralytics import YOLO
import os
import base64
import io
from PIL import Image
import subprocess

# Ensure consistent working directory
os.chdir(str(Path(__file__).parent.resolve()))

app = FastAPI()

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
MODEL_PATH = "best.pt"
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
RUNS_DIR = Path("runs/segment/predict")

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Load model
model = YOLO(MODEL_PATH)

def cleanup_files(*paths: Path):
    for path in paths:
        try:
            path.unlink(missing_ok=True)
        except Exception as e:
            print(f"Error deleting {path}: {e}")


@app.post("/predict/")
async def predict(file: UploadFile = File(...), media_type: str = Form(...)):
    suffix = Path(file.filename).suffix
    input_path = UPLOAD_DIR / f"{uuid.uuid4()}{suffix}"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if media_type == "image":
        results = model.predict(source=str(input_path), imgsz=640, conf=0.3)
        annotated_image = results[0].plot(labels=False)
        output_path = OUTPUT_DIR / f"{uuid.uuid4()}.jpg"
        cv2.imwrite(str(output_path), annotated_image)

        masks_b64 = []
        if results[0].masks is not None:
            masks = results[0].masks.data.cpu().numpy()
            for mask in masks:
                binary_mask = (mask > 0).astype(np.uint8) * 255
                pil_mask = Image.fromarray(binary_mask)
                buffered = io.BytesIO()
                pil_mask.save(buffered, format="PNG")
                b64_mask = base64.b64encode(buffered.getvalue()).decode()
                masks_b64.append(b64_mask)

        return {
            "annotated_image": f"/outputs/{output_path.name}",
            "masks": masks_b64,
        }

    elif media_type == "video":
        results = model.predict(
            source=str(input_path),
            save=True,
            project="runs/segment",
            name="predict",
            vid_stride=5,
            imgsz=480,
            exist_ok=True
        )

        run_dir = Path("runs/segment/predict")
        avi_files = sorted(run_dir.rglob("*.avi"), key=os.path.getctime, reverse=True)

        if not avi_files:
            return JSONResponse(status_code=500, content={"error": "Processed AVI video not found."})

        avi_path = avi_files[0]
        mp4_path = avi_path.with_suffix(".mp4")

        try:
            subprocess.run([
                "ffmpeg", "-y",
                "-i", str(avi_path),
                str(mp4_path)
            ], check=True)
            avi_path.unlink(missing_ok=True)
        except subprocess.CalledProcessError as e:
            return JSONResponse(status_code=500, content={"error": f"FFmpeg conversion failed: {str(e)}"})

        # Compute the relative path from FastAPI's mount point
        relative_url = f"/runs/segment/{avi_path.parent.name}/{mp4_path.name}"
        return {"processed_video_url": relative_url}


# Static mounts
app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")
app.mount("/runs/segment", StaticFiles(directory="runs/segment"), name="segment")