"use client"

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      
      {/* Gradiente Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-black" />

      {/* Glow animado */}
      <motion.div
        animate={{
          x: ["-10%", "10%", "-10%"],
          y: ["-10%", "10%", "-10%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[800px] h-[800px] bg-yellow-500/20 rounded-full blur-3xl"
        style={{ top: "10%", left: "20%" }}
      />

      <motion.div
        animate={{
          x: ["10%", "-10%", "10%"],
          y: ["10%", "-10%", "10%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[700px] h-[700px] bg-indigo-500/20 rounded-full blur-3xl"
        style={{ bottom: "10%", right: "20%" }}
      />
    </div>
  );
}