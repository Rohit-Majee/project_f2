import { Link } from "react-router";
import { Newspaper, Camera } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-100 px-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-400 mb-4">
          Welcome to Project F2
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          AI-Powered Fake News & Deep Fake Detection System. Explore our tools
          to detect misinformation and protect digital trust.
        </p>
      </div>

      {/* Card Section */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Fake News Card */}
        <Link
          to="/fakenews"
          className="group bg-gray-900 border border-gray-800 hover:border-indigo-500 rounded-2xl shadow-lg p-8 flex flex-col items-center transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1"
        >
          <Newspaper className="h-16 w-16 text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
          <h2 className="text-2xl font-bold mb-3">Fake News Detector</h2>
          <p className="text-gray-400 text-center mb-4">
            Analyze news articles and verify authenticity using our AI-powered
            detection model.
          </p>
          <span className="text-indigo-400 font-semibold group-hover:underline">
            Explore →
          </span>
        </Link>

        {/* Deep Fake Card */}
        <Link
          to="/deepfake"
          className="group bg-gray-900 border border-gray-800 hover:border-indigo-500 rounded-2xl shadow-lg p-8 flex flex-col items-center transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-1"
        >
          <Camera className="h-16 w-16 text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
          <h2 className="text-2xl font-bold mb-3">Deep Fake Detector</h2>
          <p className="text-gray-400 text-center mb-4">
            Upload and detect manipulated media with advanced deepfake detection
            algorithms.
          </p>
          <span className="text-indigo-400 font-semibold group-hover:underline">
            Explore →
          </span>
        </Link>
      </div>
    </div>
  );
}
