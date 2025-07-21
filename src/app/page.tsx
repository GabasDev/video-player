"use client";
import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

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

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(0, video.currentTime + seconds);
      setCurrentTime(video.currentTime);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
      video.muted = false;
      setIsMuted(false);
      setVolume(newVolume);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const newTime = parseFloat(e.target.value);
    if (video) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
          <source src="/assets/video012.mp4" type="video/mp4" />
          Seu navegador não suporta vídeo.
        </video>

        <div className="bg-gray-800 p-4 space-y-4">
          {/* Botões principais */}
          <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center">
            <button
              onClick={togglePlay}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition"
            >
              {isPlaying ? "⏸️ Pausar" : "▶️ Reproduzir"}
            </button>

            <button
              onClick={() => skipTime(-10)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              ⏪ Voltar 10s
            </button>

            <button
              onClick={() => skipTime(10)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Avançar 10s ⏩
            </button>
          </div>

          {/* Barra de progresso */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full"
            />
            <span className="text-sm text-white">{formatTime(duration)}</span>
          </div>

          {/* Volume e Mute */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-white text-sm">Volume</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-32"
              />
            </div>
            <button
              onClick={toggleMute}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              {isMuted ? "🔇 Desmutar" : "🔊 Mutar"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
