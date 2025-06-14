import React, { useState } from "react";

function Upload() {
  const [mediaType, setMediaType] = useState("image");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("media_type", mediaType);

    try {
      const res = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert("Error during inference");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-4">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">
            Analyze Road Media for Pothole Detection
          </h1>
          <p className="text-indigo-800 text-lg">
            Upload an image or video. InfraScan highlights potholes with confidence above 80%.
          </p>
        </header>

        {/* Instruction Box Centered */}
        <div className="flex flex-col items-center justify-center mt-0">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-indigo-200 w-[400px] w-full text-center mb-8">
            <h2 className="text-xl font-semibold text-indigo-800 mb-1">Steps to Use:</h2>
            <ol className="list-decimal list-inside text-indigo-700 text-sm text-left">
              <li>Select the media type: <strong>Image</strong> or <strong>Video</strong>.</li>
              <li>Upload a file using the button below.</li>
              <li>Click <strong>Upload & Predict</strong>.</li>
              <li>Wait a few seconds for analysis to complete.</li>
              <li>View highlighted regions indicating pothole detections.</li>
            </ol>
          </div>

          {/* Media type selection */}
          <div className="flex items-center gap-6 text-indigo-800 font-medium mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mediaType"
                checked={mediaType === "image"}
                onChange={() => {
                  setMediaType("image");
                  setFile(null);
                  setPreviewUrl(null);
                  setResult(null);
                }}
                className="accent-indigo-600"
              />
              Image
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mediaType"
                checked={mediaType === "video"}
                onChange={() => {
                  setMediaType("video");
                  setFile(null);
                  setPreviewUrl(null);
                  setResult(null);
                }}
                className="accent-indigo-600"
              />
              Video
            </label>
          </div>

          {/* File Upload */}
          <form onSubmit={onSubmit} className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="file"
              accept={mediaType === "image" ? "image/*" : "video/*"}
              onChange={onFileChange}
              className="file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-700 file:text-white
                         hover:file:bg-indigo-600 cursor-pointer"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-600 disabled:opacity-50"
            >
              Upload & Predict
            </button>
          </form>

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-3 text-indigo-700 mt-4">
              <div className="w-6 h-6 border-4 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
              <span>Processing... please wait</span>
            </div>
          )}

          {/* Preview */}
          {previewUrl && !loading && (
            <div className="text-center mt-6">
              <h3 className="text-md font-semibold text-indigo-900 mb-2">Preview</h3>
              {mediaType === "image" ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="rounded-lg shadow-md max-h-[300px] object-contain border border-indigo-300 mx-auto"
                />
              ) : (
                <video
                  controls
                  src={previewUrl}
                  className="rounded-lg shadow-md max-h-[300px] border border-indigo-300 mx-auto"
                />
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {!loading && result && (
          <div className="mt-12 space-y-10">
            {mediaType === "image" ? (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-lg shadow border border-indigo-200">
                  <h3 className="text-center text-lg font-bold text-indigo-800 mb-2">Annotated Output</h3>
                  <img
                    src={`http://localhost:8000${result.annotated_image}`}
                    alt="Annotated"
                    className="rounded shadow w-full object-contain max-h-[400px]"
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-indigo-200">
                  <h3 className="text-center text-lg font-bold text-indigo-800 mb-2">Segmented Masks</h3>
                  {result.masks.length > 0 ? (
                    <div className="grid gap-4">
                      {result.masks.map((mask, i) => (
                        <img
                          key={i}
                          src={`data:image/png;base64,${mask}`}
                          alt={`Mask ${i + 1}`}
                          className="rounded shadow mx-auto object-contain max-h-[400px] w-full"
                        />  
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-indigo-600">No masks detected</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-bold text-indigo-900 mb-3">Processed Video Output</h3>
                <video
                  controls
                  className="w-full rounded-lg shadow-lg border border-indigo-300 max-w-4xl mx-auto"
                >
                  <source src={`http://localhost:8000${result.processed_video_url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
