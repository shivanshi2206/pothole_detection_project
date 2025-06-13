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
    setResult(null); // Reset result
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8 flex flex-col items-center">
      <header className="max-w-3xl text-center mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4 drop-shadow-sm">
          Upload Road Media for Pothole Detection
        </h1>
        <p className="text-lg text-indigo-800">
          Upload an image or video to analyze road conditions. InfraScan helps authorities and drivers by detecting potholes in real-time, improving maintenance response and road safety.
        </p>
      </header>

      {/* Media type selection */}
      <section className="flex gap-8 mb-6 text-indigo-900 font-medium">
        {["image", "video"].map((type) => (
          <label key={type} className="cursor-pointer flex items-center space-x-2">
            <input
              type="radio"
              name="mediaType"
              checked={mediaType === type}
              onChange={() => {
                setMediaType(type);
                setFile(null);
                setPreviewUrl(null);
                setResult(null);
              }}
              className="accent-indigo-600"
            />
            <span className="capitalize">{type}</span>
          </label>
        ))}
      </section>

      {/* Upload form */}
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row items-center gap-4 mb-10">
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

      {/* Loading Spinner */}
      {loading && (
        <div className="flex flex-col items-center text-indigo-700 mb-10">
          <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-700 rounded-full animate-spin mb-2" />
          <p className="text-md font-medium">Processing... please wait</p>
        </div>
      )}

      {/* Preview before prediction */}
      {previewUrl && !loading && (
        <div className="mb-10 text-center">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">Uploaded {mediaType}</h3>
          {mediaType === "image" ? (
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="rounded-lg shadow-md max-h-[400px] object-contain border border-indigo-300"
            />
          ) : (
            <video
              controls
              src={previewUrl}
              className="rounded-lg shadow-md max-h-[400px] border border-indigo-300"
            />
          )}
        </div>
      )}

      {/* Results for image */}
      {result && mediaType === "image" && !loading && (
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl w-full">
          <div className="bg-white p-4 rounded-lg shadow-lg border border-indigo-200">
            <h3 className="text-center text-lg font-bold text-indigo-800 mb-2">Annotated Output</h3>
            <img
              src={`http://localhost:8000${result.annotated_image}`}
              alt="Annotated"
              className="max-h-[400px] w-full object-contain rounded-md"
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg border border-indigo-200">
            <h3 className="text-center text-lg font-bold text-indigo-800 mb-4">Segmented Masks</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {result.masks.length === 0 ? (
                <p className="text-indigo-700 text-center">No masks detected</p>
              ) : (
                result.masks.map((mask, i) => (
                  <img
                    key={i}
                    src={`data:image/png;base64,${mask}`}
                    alt={`Mask ${i + 1}`}
                    className="max-w-[180px] max-h-[180px] rounded shadow"
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results for video */}
      {result && mediaType === "video" && !loading && (
        <div className="max-w-5xl w-full mt-6">
          <h3 className="text-center text-lg font-bold text-indigo-900 mb-2">Processed Video Output</h3>
          <video
            controls
            className="w-full rounded-lg shadow-lg border border-indigo-300"
          >
            <source
              src={`http://localhost:8000${result.processed_video_url}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

export default Upload;
