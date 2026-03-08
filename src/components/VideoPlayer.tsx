"use client";

import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize
} from "lucide-react";

interface Props {
  src: string;
  title?: string;
}

export default function VideoPlayer({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

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

 const skipForward = () => {
  const video = videoRef.current;
  if (!video) return;

  video.currentTime = Math.min(video.currentTime + 10, video.duration);
};

const skipBack = () => {
  const video = videoRef.current;
  if (!video) return;

  video.currentTime = Math.max(video.currentTime - 10, 0);
};

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);

    if (newVolume === 0) {
      video.muted = true;
      setMuted(true);
    } else {
      video.muted = false;
      setMuted(false);
    }
  };

  const handleTimeUpdate = () => {
  const video = videoRef.current;
  if (!video || !video.duration) return;

  const percent = (video.currentTime / video.duration) * 100;
  setProgress(percent);
};

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
  const video = videoRef.current;
  if (!video || !video.duration) return;

  const percent = Number(e.target.value);
  const newTime = (percent / 100) * video.duration;

  video.currentTime = newTime;
};

  const fullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    video.requestFullscreen();
  };

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loaded = () => setDuration(video.duration);

    video.addEventListener("loadedmetadata", loaded);

    return () => {
      video.removeEventListener("loadedmetadata", loaded);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">

      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
      />
      {!isPlaying && (
  <button
    onClick={togglePlay}
    className="absolute inset-0 flex items-center justify-center"
  >
    <div className="bg-black/60 p-5 rounded-full hover:scale-110 transition">
      <Play size={40} className="text-white ml-1"/>
    </div>
  </button>
)}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pointer-events-auto">

        {/* Barra de progresso */}
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="w-full mb-2"
        />

        <div className="flex items-center justify-between text-white text-sm">

          <div className="flex items-center gap-3">

            <button
  onClick={togglePlay}
  className="focus:outline-none hover:scale-110 transition"
>
  {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
</button>

           <button
  onClick={skipBack}
  className="focus:outline-none hover:scale-110 transition"
>
  <SkipBack size={18}/>
</button>

<button
  onClick={skipForward}
  className="focus:outline-none hover:scale-110 transition"
>
  <SkipForward size={18}/>
</button>

<button
  onClick={toggleMute}
  className="focus:outline-none hover:scale-110 transition"
>
  {muted ? <VolumeX size={18}/> : <Volume2 size={18}/>}
</button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={changeVolume}
              className="w-20"
            />

            <span>
              {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
            </span>

          </div>

         <button
  onClick={fullscreen}
  className="focus:outline-none hover:scale-110 transition"
>
  <Maximize size={18}/>
</button>

        </div>

      </div>

    </div>
  );
}