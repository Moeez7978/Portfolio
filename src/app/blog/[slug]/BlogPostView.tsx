"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { BlogPost } from "@/lib/blog";

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  AWS:              { bg: "rgba(245,158,11,0.15)",  color: "#d97706" },
  S3:               { bg: "rgba(249,115,22,0.15)",  color: "#ea580c" },
  DevOps:           { bg: "rgba(99,102,241,0.15)",  color: "#6366f1" },
  "CI/CD":          { bg: "rgba(6,182,212,0.15)",   color: "#0891b2" },
  Cloud:            { bg: "rgba(14,165,233,0.15)",  color: "#0284c7" },
  "Cloud Storage":  { bg: "rgba(59,130,246,0.15)",  color: "#2563eb" },
  Architecture:     { bg: "rgba(139,92,246,0.15)",  color: "#7c3aed" },
  "GitHub Actions": { bg: "rgba(16,185,129,0.15)",  color: "#059669" },
  Career:           { bg: "rgba(244,63,94,0.15)",   color: "#e11d48" },
};

function tagStyle(tag: string) {
  return TAG_STYLES[tag] ?? { bg: "rgba(100,116,139,0.15)", color: "#475569" };
}

function readingTime(content: string) {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPostView({ post }: { post: BlogPost }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const mins = readingTime(post.content);

  return (
    <ThemeProvider>
      <Navbar />

      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX, transformOrigin: "0%" }}
        className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-gradient-to-r from-primary via-accent to-emerald"
      />

      <main className="relative z-10 min-h-screen pb-24">
        {/* Hero banner */}
        <div className="relative overflow-hidden pt-32 pb-12 mb-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-96 h-72 rounded-full blur-[160px] opacity-20" style={{ background: "rgba(99,102,241,0.5)" }} />
            <div className="absolute bottom-0 right-1/4 w-80 h-60 rounded-full blur-[120px] opacity-15" style={{ background: "rgba(6,182,212,0.4)" }} />
          </div>

          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-primary transition-colors" style={{ color: "var(--text-muted)" }}>
                <ArrowLeft size={15} /> All Posts
              </Link>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {post.tags.map((tag) => {
                  const s = tagStyle(tag);
                  return (
                    <span key={tag} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ background: s.bg, color: s.color }}>
                      <Tag size={9} /> {tag}
                    </span>
                  );
                })}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: "var(--text-primary)" }}>
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-5 pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                  <Calendar size={14} /> {post.date}
                </span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                  <Clock size={14} /> {mins} min read
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Article body */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-3xl mx-auto px-6"
        >
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Footer nav */}
          <div className="mt-16 pt-8 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors" style={{ color: "var(--text-muted)" }}>
              <ArrowLeft size={15} /> Back to Blog
            </Link>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => {
                const s = tagStyle(tag);
                return (
                  <span key={tag} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{ background: s.bg, color: s.color }}>
                    <Tag size={9} /> {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </motion.article>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
