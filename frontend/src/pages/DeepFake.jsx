import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function DeepFake() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("image"); // "image" | "video"

  const deepfakeMutation = useMutation({
    mutationFn: async (formData) => {
      // Ensure the endpoint matches the FastAPI router prefix
      const response = await axios.post(`${BASE_URL}/api/deepfake`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onError: (error) => {
      const message =
        error?.response?.data?.detail ||
        error.message ||
        "Something went wrong!";
      toast.error(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a file before analyzing.");
      return;
    }

    // NEW: File Size Safety Check (50MB Limit)
    const MAX_FILE_SIZE_MB = 50;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(
        `File is too large! Please upload a video under ${MAX_FILE_SIZE_MB}MB.`,
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", mode);
    deepfakeMutation.mutate(formData);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-100 px-6 py-12">
      {/* Header Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Deepfake Detector
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Upload an image or video, and our AI-powered system will analyze it to
          detect potential deepfake content.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-10 transition-all duration-300 hover:shadow-indigo-500/20">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image/Video Toggle Buttons */}
          <div className="flex justify-center gap-6">
            <button
              type="button"
              className={`px-6 py-2 rounded-xl font-semibold transition-all 
                ${
                  mode === "image"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
                }`}
              onClick={() => {
                setMode("image");
                setFile(null);
                deepfakeMutation.reset();
              }}
            >
              Image
            </button>

            <button
              type="button"
              className={`px-6 py-2 rounded-xl font-semibold transition-all 
                ${
                  mode === "video"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
                }`}
              onClick={() => {
                setMode("video");
                setFile(null);
                deepfakeMutation.reset();
              }}
            >
              Video
            </button>
          </div>

          {/* Upload Media */}
          <div>
            <label className="block text-lg font-semibold text-indigo-400 mb-4">
              Upload {mode === "image" ? "Image" : "Video"}
            </label>

            <div className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800 hover:border-indigo-500 hover:bg-gray-850 transition group">
              {file ? (
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-green-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-300">
                    <span className="font-semibold text-indigo-400">
                      Selected:{" "}
                    </span>
                    {file.name}
                  </p>
                </div>
              ) : (
                <>
                  <svg
                    className="w-14 h-14 text-indigo-400 mb-3 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5.002 5.002 0 0115.9 6H16a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-400 text-sm">
                    Drag & drop your {mode} file here, or{" "}
                    <span className="text-indigo-400 font-semibold cursor-pointer">
                      browse
                    </span>
                  </p>
                </>
              )}

              <input
                type="file"
                accept={mode === "image" ? "image/*" : "video/*"}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  deepfakeMutation.reset();
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={deepfakeMutation.isPending}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-transform duration-300 hover:scale-105 shadow-lg"
          >
            {deepfakeMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                Analyzing Media...
              </span>
            ) : (
              "Analyze Media"
            )}
          </button>
        </form>
      </div>

      {/* Output Section */}
      {deepfakeMutation.isSuccess && deepfakeMutation.data && (
        <div className="mt-12 w-full max-w-2xl animate-fade-in">
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-400 mb-6 border-b border-gray-800 pb-3">
              Forensic Analysis Result
            </h2>

            <div className="space-y-4">
              <p className="text-lg flex justify-between items-center">
                <span className="font-semibold text-gray-400">
                  File Analyzed:
                </span>
                <span className="text-gray-200 text-sm">
                  {deepfakeMutation.data.filename}
                </span>
              </p>

              <p className="text-lg flex justify-between items-center">
                <span className="font-semibold text-gray-400">Verdict:</span>
                <span
                  className={`px-4 py-1 rounded-md uppercase tracking-wider font-bold text-sm ${
                    deepfakeMutation.data.result.toUpperCase().includes("FAKE")
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-green-500/20 text-green-400 border border-green-500/30"
                  }`}
                >
                  {deepfakeMutation.data.result}
                </span>
              </p>

              <p className="text-lg flex justify-between items-center">
                <span className="font-semibold text-gray-400">Confidence:</span>
                <span className="text-yellow-400 font-bold text-xl">
                  {deepfakeMutation.data.confidence.toFixed(2)}%
                </span>
              </p>

              <p className="text-lg flex justify-between items-center">
                <span className="font-semibold text-gray-400">
                  Raw Anomaly Score:
                </span>
                <span className="text-gray-300 font-mono">
                  {deepfakeMutation.data.score_raw}
                </span>
              </p>

              {/* Only show frames used if the backend returned it (for video) */}
              {deepfakeMutation.data.frames_used && (
                <p className="text-lg flex justify-between items-center">
                  <span className="font-semibold text-gray-400">
                    Frames Analyzed:
                  </span>
                  <span className="text-indigo-300 font-bold">
                    {deepfakeMutation.data.frames_used}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
