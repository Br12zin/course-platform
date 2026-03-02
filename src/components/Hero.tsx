"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white px-6">
      

      <AnimatedBackground />

      <div className="max-w-3xl">
      <motion.header
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ color: "#0f3d3e" }} 
          className="text-5xl md:text-6xl font-serif font-bold leading-tight pb-30"
        >
          HSP
        </motion.header>
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ color: "#1b5e63" }}
          className="text-5xl md:text-6xl font-serif font-bold leading-tight"
        >
          Aprofundando nas Escrituras.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          style={{ color: "#4a6f73" }}
          className="mt-6 text-lg text-white/80 leading-relaxed"
        >
          Transformar conhecimento em propósito.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6 }}
          className="mt-10"
        >
            <Link href="/tela-inicial">
                <button className="px-8 py-4 bg-yellow-500 text-black font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-yellow-500/40 transition duration-300">
                    Ir para Aulas -&gt;
                </button>
            </Link>
        </motion.div>

      </div>
    </section>
  );
}