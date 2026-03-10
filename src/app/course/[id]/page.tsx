import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import { getVideo } from "@/lib/videos";

export default async function CoursePage({
  params,
}: {
  params: { id: number }; // aqui não precisa ser Promise
}) {
  const { id } = params;

  const video = await getVideo(id);

  if (!video) {
    return (
      <div className="p-10 text-center text-white">
        Vídeo não encontrado
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-10">

      {/* Botão de voltar */}
      <Link
        href="/tela-inicial"
        className="mb-6 text-yellow-500 hover:text-yellow-400 inline-block"
      >
        ← Voltar aos cursos
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-white">
        {video.title}
      </h1>

      {/* Passando src e duration para o VideoPlayer */}
      <VideoPlayer
        src={`http://127.0.0.1:8000${video.url}`}
        title={video.title}
        duration={video.duration ? parseDurationToSeconds(video.duration) : undefined}
      />

      <p className="mt-6 text-lg text-gray-400">
        {video.description}
      </p>

    </div>
  );
}

// Função utilitária para converter "mm:ss" em segundos
function parseDurationToSeconds(duration: string) {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
}