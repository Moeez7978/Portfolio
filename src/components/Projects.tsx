"use client";
import { motion } from "framer-motion";
import { ExternalLink, Cloud, Workflow, Container } from "lucide-react";

const projects = [
  {
    title: "Azure Auto Scaling Infrastructure",
    desc: "Deployed highly available infrastructure using Azure VMSS, Auto Scaling, Load Balancer and Health Probe. Ensured smooth deployment of backend APIs with automated scaling and self-healing architecture.",
    tags: ["Azure", "VMSS", "Load Balancer", "Auto Scaling"],
    icon: Cloud,
    color: "from-primary to-accent",
    iconColor: "text-primary",
  },
  {
    title: "CI/CD Pipeline with GitHub Actions",
    desc: "Configured a complete CI/CD pipeline for a full-stack React app including linting, automated tests, code coverage via Codecov, and zero-downtime deployment to Amazon EC2.",
    tags: ["GitHub Actions", "CI/CD", "AWS EC2", "Codecov"],
    icon: Workflow,
    color: "from-accent to-emerald",
    iconColor: "text-accent",
  },
  {
    title: "Containerized Python App with Docker Swarm",
    desc: "Created a production-grade Dockerfile for a Python backend service. Configured Docker Swarm to deploy and load-balance across multiple nodes for scalability and reliability.",
    tags: ["Docker", "Docker Swarm", "Python", "Load Balancing"],
    icon: Container,
    color: "from-emerald to-amber",
    iconColor: "text-emerald",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-28 relative">
      <div className="absolute top-20 left-1/2 w-96 h-96 rounded-full blur-[180px] opacity-10" style={{ background: "rgba(99, 102, 241, 0.2)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-amber mb-4" style={{ background: "var(--bg-tertiary)" }}>
            MY WORK
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Real-world infrastructure and deployment solutions I&apos;ve built
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card rounded-2xl overflow-hidden group"
            >
              {/* Project image placeholder with gradient overlay */}
              <div className="relative w-full h-48 overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <project.icon size={48} className={`${project.iconColor} opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500`} />
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs px-2 py-1 rounded-md glass" style={{ color: "var(--text-muted)" }}>Screenshot</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors" style={{ color: "var(--text-primary)" }}>
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-[11px] font-medium rounded-full"
                      style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                  <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-light transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    Code
                  </a>
                  <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-light transition-colors">
                    <ExternalLink size={16} />
                    Live
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
