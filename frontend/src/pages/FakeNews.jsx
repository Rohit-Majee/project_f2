import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function FakeNews() {
  const [text, setText] = useState("");
  const [modelChoice, setModelChoice] = useState("roberta"); // Default to the new PyTorch model

  const analyzeNews = useMutation({
    mutationFn: async (newsText) => {
      // Ensure the endpoint matches the backend router prefix
      const response = await axios.post(`${BASE_URL}/api/fakenews`, {
        text: newsText,
        model_choice: modelChoice, 
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
    if (!text.trim()) return;
    analyzeNews.mutate(text);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-100 px-6 py-10">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Fake News Detector
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Paste a news article and our AI-powered system will analyze its authenticity.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-8 transition-all duration-300 hover:shadow-indigo-500/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Model Selector Toggle */}
          <div className="flex justify-center mb-2">
            <div className="bg-gray-800 p-1 rounded-lg inline-flex shadow-inner">
              <button
                type="button"
                onClick={() => setModelChoice("roberta")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  modelChoice === "roberta"
                    ? "bg-indigo-500 text-white shadow-md"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Deep Learning (RoBERTa)
              </button>
              <button
                type="button"
                onClick={() => setModelChoice("traditional")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  modelChoice === "traditional"
                    ? "bg-indigo-500 text-white shadow-md"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Traditional ML (SVM)
              </button>
            </div>
          </div>

          {/* Input Text Area */}
          <div>
            <label
              htmlFor="newsInput"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Enter News Article
            </label>
            <textarea
              id="newsInput"
              rows="6"
              placeholder="Paste the news text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={analyzeNews.isPending}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-transform duration-300 hover:scale-105"
          >
            {analyzeNews.isPending ? "Analyzing..." : "Analyze News"}
          </button>
        </form>
      </div>

      {/* Output Section */}
      {analyzeNews.isSuccess && (
        <div className="mt-10 w-full max-w-2xl">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-indigo-400 mb-6 border-b border-gray-800 pb-3">
              Analysis Result
            </h2>
            
            <div className="space-y-4">
              <p className="text-lg flex justify-between items-center">
                <span className="font-semibold text-gray-400">Engine Used:</span>{" "}
                <span className="text-gray-100 bg-gray-800 px-3 py-1 rounded-md text-sm">
                  {analyzeNews.data.model_used}
                </span>
              </p>
              
              <p className="text-lg flex justify-between items-center">
                <span className="font-semibold text-gray-400">Verdict:</span>{" "}
                <span
                  className={`px-4 py-1 rounded-md uppercase tracking-wider font-bold text-sm ${
                    analyzeNews.data.result.toUpperCase().includes("FAKE")
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-green-500/20 text-green-400 border border-green-500/30"
                  }`}
                >
                  {analyzeNews.data.result}
                </span>
              </p>

              <p className="text-lg flex justify-between items-center">
                <span className="font-semibold text-gray-400">Confidence:</span>{" "}
                {/* Removed the * 100 multiplier since the backend handles it now */}
                <span className="text-yellow-400 font-bold text-xl">
                  {analyzeNews.data.confidence.toFixed(1)}%
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Section */}
      {analyzeNews.isError && (
        <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 font-semibold max-w-2xl w-full text-center">
          Something went wrong: {analyzeNews.error.message}
        </div>
      )}
    </div>
  );
}