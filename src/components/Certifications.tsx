"use client";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const certs = [
  { name: "AWS Solutions Architect Associate", code: "SAA-C03", date: "May 2026", badge: "/aws-saa.png", issuer: "Amazon Web Services" },
  { name: "Getting Started with Docker", code: "Docker", date: "April 2025", badge: "/docker-badge.svg", issuer: "Docker Inc." },
  { name: "Azure Cloud Fundamentals", code: "AZ-900", date: "Feb 2025", badge: "/az-900.png", issuer: "Microsoft" },
  { name: "Basics of Computer Networks", code: "Networking", date: "Dec 2024", badge: "/networking.png", issuer: "Cisco / Coursera" },
];

const comingSoon = [
  { name: "Azure Administrator Associate", code: "AZ-104", badge: "/az-104.png", issuer: "Microsoft" },
  { name: "AWS Solutions Architect Professional", code: "SAP-C02", badge: "/aws-sap.png", issuer: "Amazon Web Services" },
];

const skills = [
  { label: "AWS",            icon: "/skill-aws.svg" },
  { label: "Azure",          icon: "/skill-azure.svg" },
  { label: "Docker",         icon: "/skill-docker.svg" },
  { label: "Kubernetes",     icon: "/skill-k8s.svg" },
  { label: "Terraform",      icon: "/skill-terraform.svg" },
  { label: "Linux",          icon: "/skill-linux.svg" },
  { label: "Python",         icon: "/skill-python.svg" },
  { label: "GitHub Actions", icon: "/skill-ghactions.svg" },
  { label: "CI/CD",          icon: "/skill-cicd.svg" },
  { label: "Networking",     icon: "/skill-networking.svg" },
];

const marqueeItems = [...skills, ...skills];

export default function Certifications() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-rose mb-4" style={{ background: "var(--bg-tertiary)" }}>
            CREDENTIALS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            <span className="gradient-text">Certifications</span>
          </h2>
        </motion.div>

        {/* Animated skill marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 relative overflow-hidden rounded-2xl card py-5"
        >
          <p className="text-center text-xs font-semibold mb-4 tracking-widest" style={{ color: "var(--text-muted)" }}>
            TOOLS &amp; TECHNOLOGIES
          </p>
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--bg-secondary), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--bg-secondary), transparent)" }} />
          <div className="overflow-hidden">
            <div className="animate-marquee items-center">
              {marqueeItems.map((skill, i) => (
                <div key={i} className="flex items-center gap-2.5 px-6 shrink-0">
                  <img src={`${basePath}${skill.icon}`} alt={skill.label} className="w-6 h-6 object-contain" />
                  <span className="text-sm font-semibold whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                    {skill.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Earned certification badges */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {certs.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card rounded-2xl p-5 flex flex-col items-center text-center gap-3 group"
            >
              <div className="w-24 h-24 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                <img src={`${basePath}${cert.badge}`} alt={cert.name} className="w-full h-full object-contain drop-shadow-md" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block" style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
                  {cert.code}
                </span>
                <h4 className="font-semibold text-sm leading-snug" style={{ color: "var(--text-primary)" }}>{cert.name}</h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{cert.issuer}</p>
                <p className="text-xs mt-0.5 font-medium text-emerald">Achieved {cert.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming soon — grayscale badges */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-widest mb-5 flex items-center gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          <Clock size={13} /> IN PROGRESS / COMING SOON
        </motion.p>
        <div className="grid sm:grid-cols-2 gap-6">
          {comingSoon.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl p-5 flex items-center gap-5 overflow-hidden"
              style={{ background: "var(--bg-secondary)", border: "1px dashed var(--border)" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 8px, rgba(128,128,128,0.05) 8px, rgba(128,128,128,0.05) 16px)" }}
              />
              <div className="w-20 h-20 shrink-0 flex items-center justify-center" style={{ filter: "grayscale(1)", opacity: 0.5 }}>
                <img src={`${basePath}${cert.badge}`} alt={cert.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 inline-block" style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
                  {cert.code}
                </span>
                <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)", opacity: 0.6 }}>{cert.name}</h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{cert.issuer}</p>
                <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                  <Clock size={9} /> Coming Soon
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
