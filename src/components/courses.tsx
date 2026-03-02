"use client";

import React from "react";
import { Calendar28 } from "./date_picker";
import { CoursesGrid } from "./courseGrid";

export default function CoursesPage() {
  return (
    <div className="p-10 w-screen">

      {/* Título principal */}
      <h1 className="text-4xl font-serif font-bold text-center mb-20 text-[#0f3d3e] tracking-wide">
        HSP TEOLOGIA
      </h1>

      {/* Header com título + calendário */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-semibold text-[#1b5e63]">
          Aulas Disponíveis
        </h2>

        <Calendar28 />
      </div>

      {/* Grid de cursos */}
      <CoursesGrid />

    </div>
  );
}