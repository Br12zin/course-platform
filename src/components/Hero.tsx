"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white px-6">

      <AnimatedBackground />

      <div className="max-w-3xl">
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-serif font-bold leading-tight"
        >
          Aprofunde-se nas Escrituras.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          className="mt-6 text-lg text-gray-300"
        >
          Cursos completos de Teologia para transformar conhecimento em propósito.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6 }}
          className="mt-10"
        >
            <Link href="/tela-inicial">
                <button className="px-8 py-4 bg-yellow-500 text-black font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-yellow-500/40 transition duration-300">
                    Explorar Cursos
                </button>
            </Link>
        </motion.div>

      </div>
    </section>
  );
}