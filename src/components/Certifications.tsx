"use client";
import { motion } from "framer-motion";
import { Award, Shield, Cloud, Server } from "lucide-react";

const certs = [
  { name: "AWS Solutions Architect Associate (SAA-C03)", date: "May 2026", icon: Cloud, color: "from-primary to-accent" },
  { name: "Getting Started with Docker", date: "April 2025", icon: Server, color: "from-accent to-emerald" },
  { name: "Microsoft Azure Cloud Fundamentals (AZ-900)", date: "Feb 2025", icon: Shield, color: "from-emerald to-amber" },
  { name: "Basics of Computer Networks", date: "Dec 2024", icon: Award, color: "from-amber to-rose" },
];

export default function Certifications() {
  return (
    <section className="py-28 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-rose mb-4" style={{ background: "var(--bg-tertiary)" }}>
            CREDENTIALS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            <span className="gradient-text">Certifications</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {certs.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-5 rounded-2xl flex items-center gap-4 group"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${cert.color} shrink-0`}>
                <cert.icon size={22} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{cert.name}</h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Achieved {cert.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
