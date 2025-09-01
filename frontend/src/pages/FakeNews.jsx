import { useState } from "react";

export default function FakeNews() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate backend call
    setTimeout(() => {
      setResult({
        status: "Fake",
        confidence: "87%",
        message:
          "This news article is likely manipulated. Please verify from trusted sources.",
      });
      setLoading(false);
    }, 2000);
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
              className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-transform duration-300 hover:scale-105"
          >
            {loading ? "Analyzing..." : "Analyze News"}
          </button>
        </form>
      </div>

      {/* Output Section (only when result exists) */}
      {result && (
        <div className="mt-10 w-full max-w-2xl">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">
              Analysis Result
            </h2>
            <p className="text-lg">
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={
                  result.status === "Fake"
                    ? "text-red-400 font-bold"
                    : "text-green-400 font-bold"
                }
              >
                {result.status}
              </span>
            </p>
            <p className="text-lg">
              <span className="font-semibold">Confidence:</span>{" "}
              <span className="text-yellow-400 font-bold">
                {result.confidence}
              </span>
            </p>
            <p className="mt-4 text-gray-300">{result.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
