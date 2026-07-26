"use client";
import { motion } from "framer-motion";
import { Cloud, Code, Server, GraduationCap } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "4",  label: "Certifications" },
  { value: "5+", label: "Companies" },
  { value: "10+", label: "Projects Delivered" },
];

const highlights = [
  { icon: Cloud,         title: "Multi-Cloud Architecture",  desc: "Fault-tolerant AWS & Azure infra with auto-scaling, load balancing, and 99.9%+ uptime SLAs",    color: "text-primary", bg: "from-primary/20 to-primary/5" },
  { icon: Server,        title: "CI/CD & Automation",        desc: "Reduced release cycles from days to minutes with GitHub Actions — zero manual intervention",      color: "text-accent",   bg: "from-accent/20 to-accent/5" },
  { icon: Code,          title: "Infrastructure as Code",    desc: "Terraform & Docker-driven environments — reproducible, version-controlled, drift-free deployments", color: "text-emerald",  bg: "from-emerald/20 to-emerald/5" },
  { icon: GraduationCap, title: "Security & Compliance",     desc: "IAM hardening, secrets management, and network segmentation baked into every architecture",        color: "text-amber",    bg: "from-amber/20 to-amber/5" },
];

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28 relative">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] opacity-30" style={{ background: "rgba(6, 182, 212, 0.1)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-primary mb-4" style={{ background: "var(--bg-tertiary)" }}>
            WHO I AM
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Cloud infrastructure engineer who ships production-grade systems, not just prototypes
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="md:col-span-2 max-w-sm mx-auto w-full">
            <div className="relative">
              <div className="gradient-border rounded-2xl">
                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                  <img src={`${basePath}/profilebg.png`} alt="Abdul Moeez" className="w-full h-full object-cover" />
                </div>
              </div>
              <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 card px-5 py-3 rounded-xl">
                <p className="text-2xl font-bold gradient-text">3+</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Years Exp.</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="md:col-span-3 mt-8 md:mt-0">
            <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              I specialize in building cloud infrastructure that teams can actually rely on — systems that
              <span className="text-primary font-semibold"> self-heal under failure</span>,
              <span className="text-accent font-semibold"> scale without manual intervention</span>, and
              <span className="text-emerald font-semibold"> deploy without downtime</span>.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
              AWS Certified Solutions Architect (SAA-C03) with hands-on delivery across AWS, Azure, Docker, Terraform, and GitHub Actions. I&apos;ve taken products from fragile manual deployments to fully automated, observable pipelines — across startups and enterprise environments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {highlights.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="card p-4 rounded-xl flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${h.bg} shrink-0`}>
                    <h.icon size={18} className={h.color} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{h.title}</h4>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{h.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center">
                  <p className="text-2xl font-bold gradient-text">{s.value}</p>
                  <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
