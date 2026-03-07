export async function getVideos() {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/videos", {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar vídeos");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
}

export async function getVideo(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/videos/${id}`, {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar vídeo");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
}