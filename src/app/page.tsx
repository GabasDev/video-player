"use client";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="w-full max-w-3xl bg-black rounded-lg shadow-lg overflow-hidden">
        <video
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full"
        >
          <source src="/videos/meuvideo.mp4" type="video/mp4" />
          Seu navegador não suporta o vídeo.
        </video>

        <div className="bg-gray-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={togglePlay}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow transition"
          >
            {isPlaying ? "⏸️ Pausar" : "▶️ Reproduzir"}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-white">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full sm:w-60"
            />
            <span className="text-sm text-white">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
