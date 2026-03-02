"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  videos?: string[];
  thumbnail?: string;
}

export function CourseCard({
  id,
  title,
  description,
  videos,
  thumbnail,
}: CourseCardProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6 }}
    >
      {/* <Card className="h-full flex flex-col bg-blue-800/25 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:shadow-blue-900 transition-all duration-300 py-6"> */}
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

          {videos && videos.length > 0 ? (
            <div className="mb-4 h-48">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="relative h-full overflow-hidden rounded-xl"
                >
                  {playingIndex !== index && (
                    <motion.img
                      src={thumbnail || "/thumb-default.png"}
                      className="w-full h-full object-cover rounded-xl cursor-pointer"
                      onClick={() => setPlayingIndex(index)}
                      whileHover={{ scale: 1.04}}
                    />
                  )}

                  {playingIndex === index && (
                    <motion.video
                      controls
                      autoPlay
                      className="w-full h-full object-cover rounded-xl"
                      onEnded={() => setPlayingIndex(null)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <source src={video} type="video/mp4" />
                    </motion.video>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500 border border-white/10 rounded-xl bg-black/4 mb-4">
              Vídeo em breve
            </div>
          )}

          <p className="text-gray-200 mb-4">
            {description}
          </p>

          <Link
            href={`/course/${id}`}
            className="mt-auto w-50 inline-block px-5 py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:scale-105 transition duration-300 shadow-md hover:shadow-yellow-500/40 text-center"
          >
            Assistir Aulas -&gt;
          </Link>

        </CardContent>
      </Card>
    </motion.div>
  );
}