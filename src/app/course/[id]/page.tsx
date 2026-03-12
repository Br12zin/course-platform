import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import { getVideo } from "@/lib/videos";

export default async function CoursePage(
  
  { params }: { params: Promise<{ id: string }> }
) {

  const API = process.env.NEXT_PUBLIC_API_URL;
 
  const {id} = await params;
  
  const video = await getVideo(Number(id));

  if (!video) {
    return (
      <div className="p-10 text-center text-white">
        Vídeo não encontrado
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-10">

      {/* Botão de voltar */}
      <Link
        href="/tela-inicial"
        className="inline-flex items-center gap-2 mb-6 px-4 py-2 
        bg-yellow-500 hover:bg-yellow-600 
        text-black rounded-lg transition backdrop-blur-sm"
      >
        ← Voltar aos cursos
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-white">
        {video.title}
      </h1>

      <VideoPlayer
        src={`${API}${video.url}`}
        title={video.title}
        duration={
          video.duration
            ? parseDurationToSeconds(video.duration)
            : undefined
        }
      />

      <p className="mt-6 text-lg text-gray-400">
        {video.description}
      </p>

    </div>
  );
}

// converter "mm:ss" → segundos
function parseDurationToSeconds(duration: string) {
  const [minutes, seconds] = duration.split(":").map(Number);
  return minutes * 60 + seconds;
}