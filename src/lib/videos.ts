const API = process.env.NEXT_PUBLIC_API_URL;

export async function getVideos() {
  try {
    const res = await fetch(`${API}/api/videos`, {
      cache: "no-store",
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar vídeos");
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    return [];
  }
}

export async function getVideo(id: number) {
  try {
    const res = await fetch(`${API}/api/videos/${id}`, {
      cache: "no-store",
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar vídeo");
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Erro ao buscar vídeo:", error);
    return null;
  }
}