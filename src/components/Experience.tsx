"use client";
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";

const experiences = [
  {
    role: "DevOps Engineer", company: "GENCLOUDS",
    period: "Mar 2026 – Present", location: "Punjab, Pakistan", type: "Full-time",
    color: "from-primary to-accent",
    points: [
      "Owning cloud infrastructure provisioning and pipeline architecture from day one",
      "Driving adoption of IaC practices to eliminate configuration drift across environments",
    ],
  },
  {
    role: "Full Stack Developer", company: "DISTRICT-X",
    period: "Nov 2025 – Feb 2026", location: "Punjab, Pakistan", type: "Contract",
    color: "from-accent to-emerald",
    points: [
      "Architected and shipped a production Next.js + TypeScript platform with a polished, performant UI",
      "Provisioned a dual-environment VPS setup (dev/prod) with isolated networking and process management",
      "Engineered a GitHub Actions CI/CD pipeline that cut manual deployment effort to zero",
      "Retained post-launch as infrastructure owner, maintaining SLA through daily monitoring and incident response",
    ],
  },
  {
    role: "Cloud & Full Stack Engineer", company: "EASE-CLOUD",
    period: "Sep 2024 – Mar 2025", location: "Punjab, Pakistan", type: "Full-time",
    color: "from-emerald to-amber",
    points: [
      "Delivered multi-cloud deployments across AWS, Azure, and Heroku — selecting the right platform per workload cost and latency requirements",
      "Automated Azure resource lifecycle management via CLI scripting, reducing provisioning time by 60%",
      "Implemented GitHub Actions workflows that enforced quality gates and enabled continuous delivery across all projects",
    ],
  },
  {
    role: "Cloud Engineer Intern", company: "TEVTA",
    period: "May 2025 – Aug 2025", location: "Punjab, Pakistan", type: "Internship",
    color: "from-amber to-rose",
    points: [
      "Designed and validated Azure architectures covering compute, VNet segmentation, storage tiers, and managed databases",
      "Applied cloud security controls including RBAC, NSGs, and Azure Policy to meet compliance requirements",
      "Performed cost optimization analysis using Azure Cost Management, identifying 20%+ savings opportunities",
    ],
  },
  {
    role: "Front-end Developer", company: "CYBER METEORS",
    period: "May 2023 – Jan 2024", location: "Punjab, Pakistan", type: "Full-time",
    color: "from-rose to-primary",
    points: [
      "Built secure, high-performance React applications with REST API integration and role-based access control",
      "Delivered a full-stack web application from architecture to production, owning both frontend and backend layers",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 sm:py-28 relative">
      <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full blur-[150px] opacity-20" style={{ background: "rgba(16, 185, 129, 0.15)" }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-emerald mb-4" style={{ background: "var(--bg-tertiary)" }}>
            MY JOURNEY
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Work <span className="gradient-text">Experience</span>
          </h2>
        </motion.div>

        {/* Single-column timeline — works on all screen sizes */}
        <div className="relative">
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-amber opacity-30" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative pl-12 sm:pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-2 sm:left-4 top-6 w-4 h-4 rounded-full bg-gradient-to-r ${exp.color} shadow-lg`} />

                <div className="card p-5 sm:p-6 rounded-2xl relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${exp.color}`} />

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-primary" style={{ background: "var(--bg-tertiary)" }}>
                      {exp.type}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>{exp.role}</h3>
                  <p className="font-semibold text-sm text-primary mb-3">{exp.company}</p>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <Calendar size={12} /> {exp.period}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <MapPin size={12} /> {exp.location}
                    </span>
                  </div>

                  {exp.points.length > 0 && (
                    <ul className="space-y-2">
                      {exp.points.map((p, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <span className={`mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${exp.color} shrink-0`} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
