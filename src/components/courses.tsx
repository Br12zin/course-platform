"use client";

import React from "react";
import { Calendar28 } from "./date_picker";
import { CarouselHSP } from "./carosselHSP";
import { CoursesGrid } from "./courseGrid";

export default function CoursesPage() {
  return (
    <div className="p-10 w-screen">
      <h1 className="text-3xl font-bold text-center mb-20">HSP TEOLOGIA</h1>
      {/* Header com título + calendário */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Aulas Disponíveis</h1>
        <Calendar28 />
      </div>

      {/* Carrossel */}
      {/* <CarouselHSP /> */}

      {/* Grid de cursos */}
      <CoursesGrid />
    </div>
  );
}
