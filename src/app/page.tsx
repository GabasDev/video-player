'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX, ListVideo } from 'lucide-react';

// --- DADOS DOS VÍDEOS ---
// CORREÇÃO: O caminho para os vídeos foi ajustado para incluir a pasta /assets,
// conforme a sua estrutura de ficheiros.
const videoData = [
  { src: '/assets/video1.mp4', title: 'Vídeo 1' },
  { src: '/assets/video2.mp4', title: 'Vídeo 2' },
  { src: '/assets/video3.mp4', title: 'Vídeo 3' },
  // Adicione mais vídeos aqui se desejar
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Estados
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [videoIndex, setVideoIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Efeito para gerenciar os eventos do vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Resetar tempo e duração ao trocar de vídeo
    setCurrentTime(0);
    setDuration(0);

    video.volume = volume;
    video.muted = isMuted;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleVideoEnded = () => {
      // Avança para o próximo vídeo da lista
      setVideoIndex((prevIndex) => (prevIndex + 1) % videoData.length);
    };
    const syncVolumeOnExternalChange = () => {
        setVolume(video.volume);
        setIsMuted(video.muted);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleVideoEnded);
    video.addEventListener('volumechange', syncVolumeOnExternalChange);

    video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleVideoEnded);
      video.removeEventListener('volumechange', syncVolumeOnExternalChange);
    };
  }, [videoIndex]); // Este efeito executa sempre que o vídeo selecionado (videoIndex) muda.

  // --- NOVAS FUNÇÕES ---
  // Função para selecionar um vídeo da lista
  const handleVideoSelect = (index: number) => {
    if (index !== videoIndex) {
      setVideoIndex(index);
    }
  };

  // Funções de controle do player (sem alterações)
  const formatTime = (time: number): string => {
    if (isNaN(time) || time === 0) return '00:00';
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        video.play();
        setIsPlaying(true);
      }
    }
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if(videoRef.current) {
        videoRef.current.volume = newVolume;
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
            videoRef.current.muted = false;
        }
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
        setIsMuted(!isMuted);
        video.muted = !isMuted;
        if (isMuted && volume === 0) {
            setVolume(0.5);
            video.volume = 0.5;
        }
    }
  };

  return (
    // Layout principal que se adapta a telas maiores (player ao lado da lista)
    <main className="flex flex-col md:flex-row items-start justify-center min-h-screen p-4 sm:p-6 gap-6">
      
      {/* Coluna do Player */}
      <div className="w-full md:flex-1 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 truncate">
          {videoData[videoIndex].title}
        </h1>
        
        <div className="relative">
          <video
            ref={videoRef}
            src={videoData[videoIndex].src}
            className="w-full rounded-lg shadow-2xl bg-black aspect-video"
            onClick={handlePlayPause}
          />
        </div>

        {/* Controles */}
        <div className="mt-4 space-y-3">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <button onClick={() => handleSkip(-10)} className="p-2 hover:bg-gray-700 rounded-full transition-colors"><Rewind size={20} /></button>
              <button onClick={handlePlayPause} className="p-3 bg-violet-600 hover:bg-violet-700 rounded-full transition-colors">
                {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
              </button>
              <button onClick={() => handleSkip(10)} className="p-2 hover:bg-gray-700 rounded-full transition-colors"><FastForward size={20} /></button>
            </div>
            <span className="font-mono text-gray-300">{formatTime(currentTime)} / {formatTime(duration)}</span>
            <div className="flex items-center gap-2 w-32">
              <button onClick={toggleMute} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input 
                type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Coluna da Lista de Vídeos */}
      <div className="w-full md:w-72 lg:w-80 mt-8 md:mt-0">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <ListVideo size={24} />
          Lista de Reprodução
        </h2>
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {videoData.map((video, index) => (
            <li key={video.src}>
              <button
                onClick={() => handleVideoSelect(index)}
                className={`w-full text-left p-3 rounded-lg transition-colors text-sm flex items-center gap-3 ${
                  index === videoIndex
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                {index === videoIndex ? <Play size={16}/> : <div className="w-4 h-4 rounded-full bg-gray-600"></div>}
                <span className="truncate">{video.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
