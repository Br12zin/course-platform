"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoPlayer from "@/components/VideoPlayer";

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
}: CourseCardProps) {

  const videoSrc = videoUrl
    ? `http://127.0.0.1:8000/${videoUrl.replace(/^\/+/, "")}`
    : null;
console.log(videoUrl);
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="h-full flex flex-col shadow-lg bg-blue-800/25 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-blue-900/40 hover:-translate-y-2 hover:shadow-xl py-6">

        <CardHeader>
          <CardTitle className="text-white text-xl">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col flex-1">

          {/* VIDEO */}
          <div className="mb-4 overflow-hidden rounded-xl">

            {videoSrc ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <VideoPlayer
                  src={videoSrc}
                  title={title}
                />
              </div>
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-black text-gray-500 rounded-xl">
                Vídeo em breve
              </div>
            )}

          </div>

          {/* DESCRIÇÃO */}
          <p className="text-gray-200 mb-4 text-sm line-clamp-3">
            {description}
          </p>

          {/* BOTÃO */}
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