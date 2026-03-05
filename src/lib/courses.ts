import { getVideos } from './videos';

// Esta função substitui o array estático courses
export async function getCourses() {
  const videos = await getVideos();
  
  // Mapeia os vídeos do banco para o formato esperado pelo CourseCard
  return videos.map((video: any) => ({
    id: video.id.toString(),
    title: video.title,
    description: video.description,
    videoUrl: video.url,  // ← PASSA A URL DO VÍDEO
    thumbnail: video.thumbnail || '/thumb-default.png',
    duration: video.duration
  }));
}