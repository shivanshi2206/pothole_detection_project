from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import shutil
import uuid
import torch
import numpy as np
from PIL import Image
import base64
import io
import os
import cv2
import subprocess
import albumentations as A
from albumentations.pytorch import ToTensorV2
import segmentation_models_pytorch as smp

# Set working directory
os.chdir(str(Path(__file__).parent.resolve()))

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Device & Model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = smp.UnetPlusPlus(
    encoder_name="efficientnet-b3",
    encoder_weights=None,
    in_channels=3,
    classes=1,
    decoder_dropout=0.2
).to(device)
model.load_state_dict(torch.load("efficientnet-b3_unet_best_3.pth", map_location=device))
model.eval()

# Transform
transform = A.Compose([
    A.Resize(256, 256),
    A.Normalize(mean=(0.485, 0.456, 0.406),
                std=(0.229, 0.224, 0.225)),
    ToTensorV2()
])

def predict_image_segmentation(image_path):
    image = Image.open(image_path).convert("RGB")
    image_np = np.array(image)
    h, w = image_np.shape[:2]

    augmented = transform(image=image_np)
    input_tensor = augmented['image'].unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_tensor)
        pred_mask = torch.sigmoid(output).squeeze().cpu().numpy()
        binary_mask = (pred_mask > 0.8).astype(np.uint8) * 255

    # Resize mask to original size
    binary_mask_resized = cv2.resize(binary_mask, (w, h))

    # Overlay mask on original image
    overlay = image_np.copy()
    overlay[binary_mask_resized > 0] = [255, 0, 0]

    # Save results
    overlay_path = OUTPUT_DIR / f"{uuid.uuid4()}.jpg"
    mask_path = OUTPUT_DIR / f"{uuid.uuid4()}_mask.png"

    Image.fromarray(overlay).save(overlay_path)
    Image.fromarray(binary_mask_resized).save(mask_path)

    with open(mask_path, "rb") as f:
        b64_mask = base64.b64encode(f.read()).decode()

    return overlay_path, b64_mask

def process_video(input_path, output_path):
    cap = cv2.VideoCapture(str(input_path))
    width, height = int(cap.get(3)), int(cap.get(4))
    fps = cap.get(cv2.CAP_PROP_FPS)
    out = cv2.VideoWriter(str(output_path), cv2.VideoWriter_fourcc(*'XVID'), fps, (width, height))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        augmented = transform(image=rgb)
        input_tensor = augmented['image'].unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(input_tensor)
            pred_mask = torch.sigmoid(output).squeeze().cpu().numpy()
            binary_mask = (pred_mask > 0.5).astype(np.uint8) * 255

        binary_mask = cv2.resize(binary_mask, (width, height))
        red_mask = np.zeros_like(frame)
        red_mask[:, :, 2] = binary_mask
        overlay = cv2.addWeighted(frame, 1.0, red_mask, 0.5, 0)
        out.write(overlay)

    cap.release()
    out.release()

def convert_to_mp4(input_path):
    output_path = input_path.with_suffix(".mp4")
    subprocess.run(["ffmpeg", "-y", "-i", str(input_path), str(output_path)], check=True)
    input_path.unlink(missing_ok=True)
    return output_path

import time

@app.post("/predict/")
async def predict(file: UploadFile = File(...), media_type: str = Form(...)):
    suffix = Path(file.filename).suffix
    input_path = UPLOAD_DIR / f"{uuid.uuid4()}{suffix}"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"[INFO] Received {media_type.upper()} file: {input_path.name}")

    if media_type == "image":
        start_time = time.time()

        overlay_path, b64_mask = predict_image_segmentation(input_path)

        elapsed = time.time() - start_time
        print(f"[INFO] Image processed in {elapsed:.2f} seconds")

        return {
            "annotated_image": f"/outputs/{overlay_path.name}",
            "masks": [b64_mask],
        }

    elif media_type == "video":
        start_time = time.time()

        avi_output_path = OUTPUT_DIR / f"{uuid.uuid4()}.avi"
        print(f"[INFO] Starting video processing...")

        process_video(input_path, avi_output_path)
        print(f"[INFO] Video processing complete. Converting to MP4...")

        mp4_path = convert_to_mp4(avi_output_path)
        elapsed = time.time() - start_time

        print(f"[INFO] Total time from upload to processed MP4: {elapsed:.2f} seconds")

        return {
            "processed_video_url": f"/outputs/{mp4_path.name}"
        }

    else:
        print("[ERROR] Invalid media type.")
        return JSONResponse(status_code=400, content={"error": "Invalid media type."})


app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")
