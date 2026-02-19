"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    <Card className="hover:shadow-lg transition py-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        {videos && videos.length > 0 ? (
          <div className="space-y-4 mb-4">
            {videos.map((video, index) => (
              <div key={index} className="relative">

                {/* THUMBNAIL */}
                {playingIndex !== index && (
                  <img
                    src={thumbnail || "/thumb-default.png"}
                    className="w-full rounded-lg cursor-pointer"
                    onClick={() => setPlayingIndex(index)}
                  />
                )}

                {/* VIDEO */}
                {playingIndex === index && (
                  <video
                    controls
                    autoPlay
                    className="w-full rounded-lg"
                    onEnded={() => setPlayingIndex(null)}
                  >
                    <source src={video} type="video/mp4" />
                  </video>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-400 border rounded-lg">
            Vídeo em breve
          </div>
        )}

        <p className="text-muted-foreground mb-4">{description}</p>

        <Link
          href={`/course/${id}`}
          className="text-[#070707c7] hover:underline"
        >
          Assistir Aula →
        </Link>
      </CardContent>
    </Card>
  );
}
