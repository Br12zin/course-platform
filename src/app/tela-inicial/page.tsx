import CoursesPage from "@/components/courses";
import React from "react";
import Menu1 from "@/components/drawer";

export default function Home() {
  return (
    <div className="bg-telas min-h-screen">
      <Menu1 />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CoursesPage />
      </div>

    </div>
  );
}