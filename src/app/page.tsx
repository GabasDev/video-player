"use client";

import { useRef, useState, useEffect } from "react";

interface Video {
  id: number;
  title: string;
  description: string;
  src: string;
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos: Video[] = [
    {
      id: 1,
      title: "Vídeo 1",
      description: "Descrição do vídeo 1",
      src: "/assets/video012.mp4",
    },
    {
      id: 2,
      title: "Vídeo 2",
      description: "Descrição do vídeo 2",
      src: "/assets/video002.mp4",
    },
    {
      id: 3,
      title: "Vídeo 3",
      description: "Descrição do vídeo 3",
      src: "/assets/video.mp4",
    },
  ];

  const [selectedVideo, setSelectedVideo] = useState<Video>(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [selectedVideo]);

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
      video.currentTime = Math.min(Math.max(0, video.currentTime + seconds), video.duration);
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
    if (video) setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) setDuration(video.duration);
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
    <main className="min-h-screen flex flex-col md:flex-row bg-gray-900 p-6 gap-6 text-white">
      {/* Lista de vídeos */}
      <aside className="md:w-72 bg-gray-800 rounded p-4 max-h-[600px] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Lista de Vídeos</h2>
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className={`block w-full text-left p-3 mb-2 rounded ${
              video.id === selectedVideo.id ? "bg-indigo-600 font-semibold" : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            <h3>{video.title}</h3>
            <p className="text-sm text-gray-300">{video.description}</p>
          </button>
        ))}
      </aside>

      {/* Player */}
      <section className="flex-1 max-w-3xl bg-black rounded shadow overflow-hidden">
        <video
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full"
          controls={false}
          key={selectedVideo.src}
        >
          <source src={selectedVideo.src} type="video/mp4" />
          Seu navegador não suporta vídeo.
        </video>

        <div className="p-4 bg-gray-800 space-y-4">
          <h2 className="text-2xl font-semibold">{selectedVideo.title}</h2>

          {/* Controles */}
          <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center">
            <button
              onClick={togglePlay}
              className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded"
            >
              {isPlaying ? "⏸️ Pausar" : "▶️ Reproduzir"}
            </button>
            <button
              onClick={() => skipTime(-10)}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
            >
              ⏪ Voltar 10s
            </button>
            <button
              onClick={() => skipTime(10)}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
            >
              Avançar 10s ⏩
            </button>
          </div>

          {/* Barra de progresso */}
          <div className="flex items-center gap-2">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1"
            />
            <span>{formatTime(duration)}</span>
          </div>

          {/* Volume e mute */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label>Volume</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="w-32"
              />
            </div>
            <button
              onClick={toggleMute}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
            >
              {isMuted ? "🔇 Desmutar" : "🔊 Mutar"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
