"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration?: string;
}

export function CourseCard({
  id,
  title,
  description,
  videoUrl,
  duration,
}: CourseCardProps) {

  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);

  // montar url do video
  const videoSrc = videoUrl
  ? `http://127.0.0.1:8000/${videoUrl.replace(/^\/+/, "")}`
  : null;

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }

    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);

    if (!videoRef.current) return;

    videoRef.current.volume = newVolume;
    setVolume(newVolume);

    if (newVolume === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="h-full flex flex-col bg-blue-800/25 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:bg-blue-900/40 hover:-translate-y-2 hover:shadow-2xl py-6">

        <CardHeader>
          <CardTitle className="text-white text-xl">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col flex-1">

          <div className="mb-4 h-48 relative overflow-hidden rounded-xl bg-black">

            {videoSrc ? (

              !isPlaying ? (

                <div
                  className="w-full h-full flex items-center justify-center cursor-pointer bg-gray-800"
                  onClick={togglePlay}
                >
                  <div className="text-center text-white">
                    <p className="text-sm mb-2">Clique para assistir</p>

                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto hover:scale-110 transition">
                      <Play className="text-black ml-1" size={24}/>
                    </div>
                  </div>

                  {duration && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {duration}
                    </span>
                  )}

                </div>

              ) : (

                <div className="relative w-full h-full">

                  <video
                    ref={videoRef}
                    src={videoSrc}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    playsInline
                    muted={isMuted}
                    onClick={togglePlay}
                    onEnded={() => setIsPlaying(false)}
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">

                    <div className="flex items-center justify-between text-white text-sm">

                      <div className="flex items-center gap-2">

                        <button onClick={togglePlay}>
                          {isPlaying ? <Pause size={16}/> : <Play size={16}/>}
                        </button>

                        <button onClick={toggleMute}>
                          {isMuted ? <VolumeX size={16}/> : <Volume2 size={16}/>}
                        </button>

                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.1}
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-16"
                        />

                      </div>

                      <button onClick={handleFullscreen}>
                        <Maximize size={16}/>
                      </button>

                    </div>

                  </div>

                </div>

              )

            ) : (

              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Vídeo em breve
              </div>

            )}

          </div>

          <p className="text-gray-200 mb-4 text-sm line-clamp-3">
            {description}
          </p>

          <Link
            href={`/course/${id}`}
            className="mt-auto w-full inline-block px-5 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:scale-105 transition duration-300 shadow-md hover:shadow-yellow-500/40 text-center"
          >
            Assistir Aulas →
          </Link>

        </CardContent>
      </Card>
    </motion.div>
  );
}