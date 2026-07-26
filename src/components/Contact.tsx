"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[180px] opacity-10" style={{ background: "rgba(99, 102, 241, 0.3)" }} />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-[140px] opacity-10" style={{ background: "rgba(6, 182, 212, 0.3)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-primary mb-4" style={{ background: "var(--bg-tertiary)" }}>
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
            Ready to bring your cloud infrastructure to the next level? Let&apos;s talk.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 lg:gap-10">
          {/* Contact info */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-2 space-y-4">
            <div className="card p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-emerald" />
              <Sparkles size={20} className="text-primary mb-3" />
              <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>Let&apos;s Build Something Great</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Whether you need cloud architecture, CI/CD pipelines, or a full-stack application — I&apos;m here to deliver results.
              </p>
            </div>

            {[
              { icon: Phone, color: "from-primary to-primary-light", label: "Phone", value: "(+92) 322-7978911", href: "https://wa.me/923227978911", hoverColor: "hover:text-primary" },
              { icon: Mail,  color: "from-accent to-accent-light",   label: "Email", value: "moeez7978911@email.com", href: "mailto:moeez7978911@email.com", hoverColor: "hover:text-accent" },
            ].map(({ icon: Icon, color, label, value, href, hoverColor }) => (
              <div key={label} className="card p-4 sm:p-5 rounded-xl flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shrink-0`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                  <a href={href} className={`font-semibold text-sm ${hoverColor} transition-colors truncate block`} style={{ color: "var(--text-primary)" }}>
                    {value}
                  </a>
                </div>
              </div>
            ))}

            <div className="card p-4 sm:p-5 rounded-xl flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald to-emerald shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>LinkedIn</p>
                <a href="https://www.linkedin.com/in/abdul-moeez-64760529b/" target="_blank"
                  className="font-semibold text-sm hover:text-emerald transition-colors truncate block" style={{ color: "var(--text-primary)" }}>
                  linkedin.com/in/abdul-moeez
                </a>
              </div>
            </div>

            <div className="card p-4 sm:p-5 rounded-xl flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber to-amber shrink-0">
                <MapPin size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Location</p>
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Lahore, Punjab, Pakistan</p>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.form initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-3 card p-6 sm:p-8 rounded-2xl space-y-5"
            onSubmit={(e) => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-muted)" }}>Name</label>
                <input type="text" placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                  style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-muted)" }}>Email</label>
                <input type="email" placeholder="john@company.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                  style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-muted)" }}>Subject</label>
              <input type="text" placeholder="Project Discussion"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-primary/30"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-muted)" }}>Message</label>
              <textarea rows={5} placeholder="Tell me about your project..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 resize-none focus:ring-2 focus:ring-primary/30"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            </div>
            <button type="submit"
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
              <Send size={16} /> Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
