"use client";

import React from "react";
import { CourseCard } from "./courseCard";
import { courses } from "@/lib/courses";

export function CoursesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8 auto-rows-fr">
      {courses.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
}
