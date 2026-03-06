"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="
          h-full flex flex-col 
          bg-blue-800/25 
          backdrop-blur-xl 
          border border-white/10 
          rounded-2xl shadow-xl 
          transition-all duration-300 
          py-6
          hover:bg-blue-900/40
          hover:-translate-y-2
          hover:shadow-2xl
        ">

        <CardHeader>
          <CardTitle className="text-white text-xl">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col flex-1">

          {/* Área do vídeo - SEM THUMBNAIL */}
          <div className="mb-4 h-48 relative overflow-hidden rounded-xl bg-black/40">
            {videoUrl ? (
              <div className="relative w-full h-full group">
                {!isPlaying ? (
                  // ✅ SEM THUMBNAIL - Apenas botão de play em fundo escuro
                  <div 
                    className="relative w-full h-full cursor-pointer bg-gray-800 flex items-center justify-center"
                    onClick={() => setIsPlaying(true)}
                  >
                    <div className="text-white text-center">
                      <p className="text-sm mb-2">Clique para assistir</p>
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition">
                        <Play className="text-black ml-1" size={24} />
                      </div>
                    </div>
                    {duration && (
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {duration}
                      </span>
                    )}
                  </div>
                ) : (
                  // Player de vídeo
                  <div 
                    className="relative w-full h-full"
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(true)}
                  >
                    <video
                      ref={videoRef}
                      src={videoUrl?.startsWith('http') ? videoUrl : `http://127.0.0.1:8000${videoUrl || ''}`}
                      className="w-full h-full object-cover"
                      autoPlay
                      onClick={togglePlay}
                      onEnded={() => setIsPlaying(false)}
                      crossOrigin="anonymous"
                    />
                    
                    {/* Controles do vídeo */}
                    {showControls && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2"
                      >
                        {/* Barra de progresso */}
                        <input
                          type="range"
                          min={0}
                          max={videoRef.current?.duration || 0}
                          value={videoRef.current?.currentTime || 0}
                          onChange={(e) => {
                            if (videoRef.current) {
                              videoRef.current.currentTime = parseFloat(e.target.value);
                            }
                          }}
                          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500 mb-2"
                        />
                        
                        {/* Botões de controle */}
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-2">
                            <button onClick={togglePlay} className="hover:text-yellow-500">
                              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                            
                            <div className="flex items-center gap-1">
                              <button onClick={toggleMute} className="hover:text-yellow-500">
                                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                              </button>
                              <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.1}
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                              />
                            </div>
                            
                            <span className="text-xs">
                              {videoRef.current && formatTime(videoRef.current.currentTime)} / 
                              {videoRef.current && formatTime(videoRef.current.duration)}
                            </span>
                          </div>
                          
                          <button onClick={handleFullscreen} className="hover:text-yellow-500">
                            <Maximize size={16} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // Placeholder quando não tem vídeo
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-black/40 rounded-xl">
                Vídeo em breve
              </div>
            )}
          </div>

          {/* Descrição */}
          <p className="text-gray-200 mb-4 text-sm line-clamp-3">
            {description}
          </p>

          {/* Botão Assistir Aulas */}
          <Link
            href={`/course/${id}`}
            className="mt-auto w-full inline-block px-5 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:scale-105 transition duration-300 shadow-md hover:shadow-yellow-500/40 text-center"
          >
            Assistir Aulas -&gt;
          </Link>

        </CardContent>
      </Card>
    </motion.div>
  );
}