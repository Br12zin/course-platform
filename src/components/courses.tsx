"use client";

import React from "react";
import { Calendar28 } from "./date_picker";
import CoursesGrid from "./courseGrid";

export default function CoursesPage() {
  return (
    <div className="py-10">

      <h1 className="text-3xl md:text-4xl font-serif font-bold text-center mb-10 text-[#0f3d3e] tracking-wide">
        HSP TEOLOGIA
      </h1>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">

        <h2 className="text-2xl md:text-3xl font-semibold text-[#1b5e63]">
          Aulas Disponíveis
        </h2>

        <Calendar28 />

      </div>

      <CoursesGrid />

    </div>
  );
}