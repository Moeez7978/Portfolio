"use client";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Tag, Clock, ArrowRight } from "lucide-react";
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

function readingTime(post: BlogPost) {
  return post.readTime;
}

const CARD_ACCENTS = [
  "from-primary to-accent",
  "from-accent to-emerald",
  "from-emerald to-amber",
];

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="relative z-10 min-h-screen pb-24">
        {/* Hero header */}
        <div className="relative overflow-hidden pt-32 pb-16 mb-4">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full blur-[140px] opacity-20" style={{ background: "rgba(99,102,241,0.4)" }} />
            <div className="absolute bottom-0 right-1/4 w-96 h-64 rounded-full blur-[120px] opacity-15" style={{ background: "rgba(6,182,212,0.4)" }} />
          </div>
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-primary transition-colors" style={{ color: "var(--text-muted)" }}>
                <ArrowLeft size={15} /> Back to Home
              </Link>
              <div className="flex items-end gap-4 mb-3">
                <h1 className="text-5xl md:text-6xl font-bold" style={{ color: "var(--text-primary)" }}>
                  The <span className="gradient-text">Blog</span>
                </h1>
                <span className="mb-2 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
                  {posts.length} posts
                </span>
              </div>
              <p className="text-lg max-w-xl" style={{ color: "var(--text-muted)" }}>
                Deep dives on cloud infrastructure, DevOps patterns, and real-world engineering decisions.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          {posts.length === 0 ? (
            <div className="card p-16 rounded-2xl text-center">
              <p style={{ color: "var(--text-muted)" }}>No posts yet. Add .md files to content/blogs/</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {posts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <div className="card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                      {/* Gradient accent bar */}
                      <div className={`h-1 w-full bg-gradient-to-r ${CARD_ACCENTS[i % CARD_ACCENTS.length]}`} />

                      <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                          <div className="flex-1 min-w-0">
                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              {i === 0 && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald/10 text-emerald">
                                  Latest
                                </span>
                              )}
                              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                                <Calendar size={11} /> {post.date}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                                <Clock size={11} /> {readingTime(post)} min read
                              </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl sm:text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug" style={{ color: "var(--text-primary)" }}>
                              {post.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                              {post.excerpt}
                            </p>

                            {/* Tags */}
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

                          {/* Arrow CTA */}
                          <div className="shrink-0 self-center">
                            <div className="w-11 h-11 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300" style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
                              <ArrowRight size={18} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
