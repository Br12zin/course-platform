"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  videos?: string[];
}

export function CourseCard({ id, title, description, videos }: CourseCardProps) {
  return (
    <Card className="hover:shadow-lg transition py-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {videos && videos.length > 0 && (
          <div className="space-y-4 mb-4">
            {videos.map((video, index) => (
              <video key={index} controls className="w-full rounded-lg">
                <source src={video} type="video/mp4" />
                Seu navegador não suporta vídeos.
              </video>
            ))}
          </div>
        )}
        <p className="text-muted-foreground mb-4">{description}</p>
        <Link href={`/courses/${id}`} className="text-[#070707c7] hover:underline">
          Assistir Aula →
        </Link>
      </CardContent>
    </Card>
  );
}
