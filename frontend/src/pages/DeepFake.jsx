import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function DeepFake() {
  const [file, setFile] = useState(null);

  const deepfakeMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${BASE_URL}/deepfake`, formData, {
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
    const formData = new FormData();
    formData.append("file", file);
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
          {/* Upload Media */}
          <div>
            <label className="block text-lg font-semibold text-indigo-400 mb-4">
              Upload Image or Video
            </label>
            <div className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800 hover:border-indigo-500 hover:bg-gray-850 transition group">
              {file ? (
                <p className="mt-4 text-sm text-gray-300">
                  <span className="font-semibold text-indigo-400">
                    Selected File:
                  </span>{" "}
                  {file.name}
                </p>
              ) : (
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
              )}
              <p className="text-gray-400 text-sm">
                {!file && (
                  <>
                    Drag & drop your file here, or{" "}
                    <span className="text-indigo-400 font-semibold">
                      browse
                    </span>{" "}
                  </>
                )}
              </p>
              <input
                type="file"
                accept="image/*,video/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={deepfakeMutation.isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-transform duration-300 hover:scale-105 shadow-lg"
          >
            {deepfakeMutation.isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                Analyzing...
              </span>
            ) : (
              "Analyze Media"
            )}
          </button>
        </form>
      </div>

      {/* Output Section */}
      {deepfakeMutation.data && (
        <div className="mt-12 w-full max-w-2xl animate-fade-in">
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-400 mb-6">
              Analysis Result
            </h2>
            <div className="space-y-4">
              <p className="text-lg">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`font-bold ${
                    deepfakeMutation.data.status.includes("Deepfake")
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {deepfakeMutation.data.status}
                </span>
              </p>
              <p className="text-lg">
                <span className="font-semibold">Confidence:</span>{" "}
                <span className="text-yellow-400 font-bold">
                  {deepfakeMutation.data.confidence}
                </span>
              </p>
              <p className="mt-4 text-gray-300 leading-relaxed">
                {deepfakeMutation.data.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
