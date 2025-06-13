# InfraScan

**InfraScan** is an AI-powered pothole detection system that combines a FastAPI backend running a Deep learnng based segmentation model and a React-based frontend. It allows users to upload road images or videos and returns annotated outputs highlighting potholes.

## Features

- Fast and accurate pothole detection in images and videos  
- Deep Learning segmentation with real-time inference(Yolov8, Unet+EfficientNet) 
- Frontend built with React for smooth user interaction with Concurrent execution of backend and frontend in a single terminal  

## Prerequisites

Ensure the following tools are installed on your system:

- Python 3.8 or above  
  https://www.python.org/downloads/  
- Node.js 14 or above  
  https://nodejs.org/en/download  
- npm (included with Node.js)   

## Project Structure

```
POTHOLE_DETECTION/
├── pothole_detection_deployment/
│   ├── civil-infra-backend/        # FastAPI backend
│   └── civil-infra-frontend/       # React frontend
├── pothole_detection_training/     # Training pipeline (optional)
├── venv/                           # Python virtual environment
├── requirements.txt                # Python backend dependencies
├── README.md
```

## Setup Instructions

### Step 1: Clone or Download the Repository

Using Git:
```bash
git clone https://github.com/shivanshi2206/pothole_detection_project.git
cd pothole_detection
```

Or manually download and extract the ZIP file.

### Step 2: Create and Activate Python Virtual Environment

Create the environment:
```bash
python -m venv venv
```

Activate it:

On Windows:
```bash
venv\Scripts\activate
```

On macOS/Linux:
```bash
source venv/bin/activate
```

### Step 3: Install Python Backend Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Install Frontend Dependencies

Navigate to the frontend folder:
```bash
cd pothole_detection_deployment/civil-infra-frontend
```

Install node modules:
```bash
npm install
```

Install concurrently to run both frontend and backend together:
```bash
npm install concurrently --save-dev
```

## Running the Full Application

To launch both frontend and backend in a single terminal, run the following from within the `civil-infra-frontend` folder:

```bash
npm run dev
```

This will start:

- React frontend at http://localhost:3000  
- FastAPI backend at http://localhost:8000  

## Notes

- Place your trained model weights (`best.pt`) inside the `civil-infra-backend` folder.  
- The application supports image and video uploads.  
- All outputs are served via `/outputs` and `/runs/segment`.  
- CORS is enabled for local development.  