import { getVideos } from "./videos";

export async function getCourses() {
  const videos = await getVideos();

  return videos.map((video: any) => ({
    id: video.id.toString(),
    title: video.title,
    description: video.description,
    videoUrl: video.url,
    duration: video.duration
  }));
}