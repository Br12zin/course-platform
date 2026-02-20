"use client";

import { useParams } from "next/navigation";
import { courses } from "@/lib/courses";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CoursePage() {
  const params = useParams();
  const id = params?.id as string;

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return <p>Curso não encontrado</p>;
  }

  return (
    <div className="p-6 space-y-6">
        <Button variant="personalizado" asChild className="text-black ">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Cursos
        </Link>
      </Button>
      <h1 className="text-2xl font-bold ml-10">{course.title}</h1>

      <p className="ml-6">{course.description}</p>

      {course.videos.length > 0 ? (
        <video controls className="w-full max-w-3xl rounded-lg">
          <source src={course.videos[0]} type="video/mp4" />
        </video>
      ) : (
        <p>Vídeos em breve</p>
      )}
    </div>
  );
}
