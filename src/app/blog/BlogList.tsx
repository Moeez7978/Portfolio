"use client";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { BlogPost } from "@/lib/blog";

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="relative z-10 min-h-screen pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 hover:text-primary transition-colors" style={{ color: "var(--text-muted)" }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              My <span className="gradient-text">Blog</span>
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              Thoughts on DevOps, cloud architecture, and software engineering
            </p>
          </motion.div>

          {posts.length === 0 ? (
            <div className="card p-12 rounded-2xl text-center">
              <p style={{ color: "var(--text-muted)" }}>No blog posts yet. Add .md files to content/blogs/ to get started.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card p-6 rounded-2xl group block"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors" style={{ color: "var(--text-primary)" }}>
                        {post.title}
                      </h2>
                      <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                          <Calendar size={12} /> {post.date}
                        </span>
                        {post.tags.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                            <Tag size={10} /> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors" style={{ background: "var(--bg-tertiary)" }}>
                      <span className="text-primary text-lg">→</span>
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
