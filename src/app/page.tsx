import Course from "@/components/courses";
import React from "react";
import Menu1 from "@/components/drawer";

export default function Home() {
  return (
    <div className="bg-telas">
    <Menu1 />
      <div className="flex flex-row items-center ml-50 mr-50">
      <Course />
      </div>
    </div>
  );
}
