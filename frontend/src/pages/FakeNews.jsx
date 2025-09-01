import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function FakeNews() {
  const [text, setText] = useState("");

  const analyzeNews = useMutation({
    mutationFn: async (newsText) => {
      const response = await axios.post(`${BASE_URL}/fakenews`, {
        text: newsText,
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
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Fake News Detector
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Paste a news article and our AI-powered system will analyze its
          authenticity.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-10 transition-all duration-300 hover:shadow-indigo-500/20">
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">
              Analysis Result
            </h2>
            <p className="text-lg">
              <span className="font-semibold">Result:</span>{" "}
              <span
                className={
                  analyzeNews.data.result.includes("Fake")
                    ? "text-red-400 font-bold"
                    : "text-green-400 font-bold"
                }
              >
                {analyzeNews.data.result}
              </span>
            </p>
            <p className="text-lg">
              <span className="font-semibold">Confidence:</span>{" "}
              <span className="text-yellow-400 font-bold">
                {(analyzeNews.data.confidence * 100).toFixed(0)}%
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Error Section */}
      {analyzeNews.isError && (
        <div className="mt-6 text-red-400 font-semibold">
          Something went wrong: {analyzeNews.error.message}
        </div>
      )}
    </div>
  );
}
