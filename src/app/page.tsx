"use client";

import { useRef, useState, useEffect } from "react";
import { FaBackward, FaForward, FaPause, FaPlay } from "react-icons/fa";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
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

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (video) {
      const newTime = Math.min(Math.max(0, time), duration);
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-[#222] flex justify-center items-center">
      <div className="w-[300px] bg-[#888] rounded-xl shadow-lg p-4">
        <div className="flex justify-center mb-4">
          <video
            ref={videoRef}
            className="w-full rounded"
            src="./assets/video01.mp4"
          />
        </div>

        <div className="flex items-center justify-center gap-4 mb-2">
          <button onClick={() => handleSeek(currentTime - 10)}>
            <FaBackward size={20} />
          </button>

          <button onClick={togglePlayPause}>
            {isPlaying ? (
              <FaPause className="text-black cursor-pointer" size={20} />
            ) : (
              <FaPlay className="text-black cursor-pointer" size={20} />
            )}
          </button>

          <button onClick={() => handleSeek(currentTime + 10)}>
            <FaForward size={20} />
          </button>
        </div>

        <input
          type="range"
          className="w-full"
          min={0}
          max={duration}
          step={0.01}
          value={currentTime}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
}
