"use client";
import { motion } from "framer-motion";
import { ArrowDown, Download, Mail, Phone, Sparkles, Zap, Shield } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-[120px] animate-pulse-glow" style={{ background: "rgba(99, 102, 241, 0.15)" }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[140px] animate-pulse-glow" style={{ background: "rgba(6, 182, 212, 0.1)", animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px]" style={{ background: "rgba(16, 185, 129, 0.05)" }} />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-32 right-20 hidden lg:block"
      >
        <div className="p-3 rounded-2xl glass">
          <Zap size={24} className="text-amber" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-40 left-20 hidden lg:block"
      >
        <div className="p-3 rounded-2xl glass">
          <Shield size={24} className="text-emerald" />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-60 left-[15%] hidden lg:block"
      >
        <div className="p-3 rounded-2xl glass">
          <Sparkles size={24} className="text-primary" />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-28 grid lg:grid-cols-2 gap-10 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Available for opportunities
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-6" style={{ color: "var(--text-primary)" }}>
            Hi, I&apos;m{" "}
            <span className="gradient-text">Abdul</span>
            <br />
            <span className="gradient-text">Moeez</span>
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-primary to-transparent" />
            <h2 className="text-lg md:text-xl font-medium" style={{ color: "var(--text-secondary)" }}>
              DevOps Engineer &amp; Cloud Architect
            </h2>
          </div>

          <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "var(--text-muted)" }}>
            I architect <span className="text-primary font-semibold">scalable cloud solutions</span>,
            build <span className="text-accent font-semibold">automated CI/CD pipelines</span>, and
            deliver <span className="text-emerald font-semibold">zero-downtime deployments</span> that
            help businesses ship faster and scale smarter.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <a
              href="#contact"
              className="group px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
              Let&apos;s Build Together
            </a>
            <a
              href={`${basePath}/resume.pdf`}
              download="Abdul_Moeez_Resume.pdf"
              className="px-7 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 gradient-border"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
            >
              <Download size={16} /> Resume
            </a>
          </div>

          {/* Social links */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Find me:</span>
            <a href="https://www.linkedin.com/in/abdul-moeez-64760529b/" target="_blank" className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ background: "var(--bg-tertiary)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--text-secondary)" }}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="mailto:moeez7978911@email.com" className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ background: "var(--bg-tertiary)" }}>
              <Mail size={18} style={{ color: "var(--text-secondary)" }} />
            </a>
            <a href="https://wa.me/923227978911" className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ background: "var(--bg-tertiary)" }}>
              <Phone size={18} style={{ color: "var(--text-secondary)" }} />
            </a>
          </div>
        </motion.div>

        {/* Hero visual - Profile with decorative rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center relative hidden sm:flex"
        >
          {/* Outer rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-80 h-80 md:w-[420px] md:h-[420px] rounded-full border border-dashed"
              style={{ borderColor: "var(--border)" }}
            />
          </div>
          {/* Inner rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="w-64 h-64 md:w-[340px] md:h-[340px] rounded-full border"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-accent" />
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald" />
            </motion.div>
          </div>

          {/* Profile image */}
          <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden relative z-10 glow" style={{ border: "3px solid var(--border)" }}>
            <img src={`${basePath}/profilepic.png`} alt="Abdul Moeez" className="w-full h-full object-cover" />
          </div>

          {/* Floating stat cards */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-4 top-1/4 card px-4 py-3 rounded-xl hidden md:block"
          >
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Certified</p>
            <p className="text-sm font-bold gradient-text">AWS SAA-C03</p>
          </motion.div>
          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -left-4 bottom-1/4 card px-4 py-3 rounded-xl hidden md:block"
          >
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Experience</p>
            <p className="text-sm font-bold gradient-text">3+ Years</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown size={18} style={{ color: "var(--text-muted)" }} />
        </motion.div>
      </motion.a>
    </section>
  );
}
