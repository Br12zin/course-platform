import Link from "next/link";
import VideoPlayer from "@/components/VideoPlayer";
import { getVideo } from "@/lib/videos";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {

  const { id } = await params;

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

      <Link
        href="/tela-inicial"
        className="inline-block mb-6 text-yellow-500 hover:text-yellow-400"
      >
        ← Voltar aos cursos
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-white">
        {video.title}
      </h1>

      <VideoPlayer
        src={`http://127.0.0.1:8000/${video.url}`}
        title={video.videoUrl}
      />

      <p className="mt-6 text-gray-400">
        {video.description}
      </p>

    </div>
  );
}