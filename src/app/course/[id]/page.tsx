"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getVideos } from "@/lib/videos";

export default function CoursePage() {
  const params = useParams();
  const id = params?.id as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        const videos = await getVideos();
        console.log("Vídeos carregados:", videos); // DEBUG
        
        const found = videos.find((v: any) => v.id.toString() === id);
        
        if (found) {
          setCourse(found);
          setError("");
        } else {
          setError("Curso não encontrado");
        }
      } catch (err) {
        console.error("Erro ao carregar curso:", err);
        setError("Erro ao carregar curso");
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [id]);

  // Loading com animação (igual aos outros)
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Erro
  if (error || !course) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error || "Curso não encontrado"}</p>
        <Button variant="personalizado" asChild className="mt-4">
          <Link href="/tela-inicial">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Cursos
          </Link>
        </Button>
      </div>
    );
  }

  // Sucesso - mostra o curso
  return (
    <div className="p-6 space-y-6">
      <Button variant="personalizado" asChild className="text-black">
        <Link href="/tela-inicial">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Cursos
        </Link>
      </Button>
      
      <h1 className="text-2xl font-bold ml-10">{course.title}</h1>
      
      <p className="ml-6 text-gray-600">{course.description}</p>

      {course.videoUrl ? (
  <div className="ml-6 max-w-4xl">
    <video 
      controls 
      className="w-full rounded-lg shadow-lg"
      poster={course.thumbnail}
    >
      <source 
        src={course.videoUrl.startsWith('http') 
          ? course.videoUrl 
          : `http://127.0.0.1:8000${course.videoUrl}`
        } 
        type="video/mp4" 
      />
      Seu navegador não suporta vídeo HTML5.
    </video>
  </div>
) : (
  <p className="ml-6 text-gray-500">Vídeo em breve</p>
)}
    </div>
  );
}