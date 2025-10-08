"use client";

import React from "react";
import { CourseCard } from "./courseCard";

const courses = [
  { id: "1", title: "Curso de React", videos: ["/videos/react-intro.mp4"], description: "Aprenda React do zero ao avançado" },
  { id: "2", title: "Curso de Next.js", videos: ["/videos/react-intro.mp4"], description: "Domine o App Router e SSR" },
  { id: "3", title: "Curso de Node.js", videos: ["/videos/react-intro.mp4"], description: "Backend moderno com Node.js e Express" },
  { id: "4", title: "Curso de React", videos: ["/videos/react-intro.mp4"], description: "Aprenda React do zero ao avançado" },
  { id: "5", title: "Curso de Next.js", videos: ["/videos/react-intro.mp4"], description: "Domine o App Router e SSR" },
  { id: "6", title: "Curso de Node.js", videos: ["/videos/react-intro.mp4"], description: "Backend moderno com Node.js e Express" }, 
];

export function CoursesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
      {courses.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
}
