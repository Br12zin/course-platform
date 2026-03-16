"use client";

import React, { useEffect, useState } from "react";
import { CourseCard } from "./courseCard";
import { getCourses } from "@/lib/courses";

interface Course {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration?: string;
}

export default function CoursesGrid() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses();

        console.log("Cursos carregados:", data);
        
        const formattedCourses = data.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          videoUrl: course.url ?? course.videoUrl ?? null,
          duration: course.duration,
        }));

        setCourses(formattedCourses);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        Nenhum curso disponível ainda.
      </div>
    );
  }

 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 auto-rows-fr">
    {courses.map((course) => (
      <CourseCard
        key={course.id}
        id={course.id}
        title={course.title}
        description={course.description}
        videoUrl={course.videoUrl}
        duration={course.duration}
      />
    ))}
  </div>
);
}