"use client";
import { motion } from "framer-motion";
import { Cloud, Workflow, Container } from "lucide-react";

const projects = [
  {
    title: "Self-Healing Auto-Scale Infrastructure on Azure",
    desc: "Eliminated single points of failure for a backend API by deploying Azure VMSS with a Load Balancer and Health Probes. The system automatically replaces unhealthy instances and scales horizontally under traffic spikes — zero manual intervention required.",
    tags: ["Azure", "VMSS", "Load Balancer", "Auto Scaling", "High Availability"],
    icon: Cloud,
    color: "from-primary to-accent",
    iconColor: "text-primary",
  },
  {
    title: "Zero-Downtime CI/CD Pipeline on AWS EC2",
    desc: "Replaced a fragile manual deploy process with a fully automated GitHub Actions pipeline — lint, test, coverage gate via Codecov, and rolling deployment to EC2. Release cycle dropped from hours to under 5 minutes with full audit trail.",
    tags: ["GitHub Actions", "AWS EC2", "CI/CD", "Codecov", "Zero Downtime"],
    icon: Workflow,
    color: "from-accent to-emerald",
    iconColor: "text-accent",
  },
  {
    title: "Production-Grade Containerized Service with Docker Swarm",
    desc: "Containerized a Python backend with a hardened multi-stage Dockerfile, then orchestrated it across a Docker Swarm cluster with built-in load balancing and rolling updates — achieving horizontal scalability without Kubernetes overhead.",
    tags: ["Docker", "Docker Swarm", "Python", "Load Balancing", "Orchestration"],
    icon: Container,
    color: "from-emerald to-amber",
    iconColor: "text-emerald",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 sm:py-28 relative">
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            Infrastructure problems I diagnosed, architected, and solved in production
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
              <div className="p-6">
                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors" style={{ color: "var(--text-primary)" }}>
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
