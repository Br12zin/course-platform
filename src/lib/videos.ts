import { Video } from '@/types';

const API_URL = 'http://127.0.0.1:8000/api';

// Buscar todos os vídeos
export async function getVideos(): Promise<Video[]> {
  const token = localStorage.getItem('token');
  
  try {
    const res = await fetch(`${API_URL}/videos`, {
      headers: {
        'Authorization': `Bearer ${token}`,  // ← CORRIGIDO!
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('Erro ao buscar vídeos');
    }

    const data = await res.json();
    
    // Mapear para o formato esperado pelo seu CourseCard
    return data.map((video: any) => ({
      id: video.id.toString(),
      title: video.title,
      description: video.description,
      videoUrl: video.url,
      duration: video.duration
    }));
    
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    return [];
  }
}