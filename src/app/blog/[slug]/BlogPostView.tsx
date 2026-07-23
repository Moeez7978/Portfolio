"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { BlogPost } from "@/lib/blog";

export default function BlogPostView({ post }: { post: BlogPost }) {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="relative z-10 min-h-screen pt-32 pb-20">
        <article className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-primary transition-colors" style={{ color: "var(--text-muted)" }}>
              <ArrowLeft size={16} /> Back to Blog
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                <Calendar size={14} /> {post.date}
              </span>
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>

            <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
          </motion.div>
        </article>
      </main>
      <Footer />
    </ThemeProvider>
  );
}
