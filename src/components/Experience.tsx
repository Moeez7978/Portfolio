"use client";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar } from "lucide-react";

const experiences = [
  {
    role: "DevOps Engineer Trainee",
    company: "GENCLOUDS",
    period: "Mar 2026 – Present",
    location: "Punjab, Pakistan",
    type: "Full-time",
    color: "from-primary to-accent",
    points: [],
  },
  {
    role: "Full Stack Developer",
    company: "DISTRICT-X",
    period: "Nov 2025 – Feb 2026",
    location: "Punjab, Pakistan",
    type: "Contract",
    color: "from-accent to-emerald",
    points: [
      "Built full stack app with Next.js & TypeScript with impressive UI",
      "Hosted on VPS with dev and production environments",
      "Built CI/CD pipeline for continuous deployment and testing automation",
      "Currently serving as maintenance engineer with daily monitoring",
    ],
  },
  {
    role: "Full Stack Developer",
    company: "EASE-CLOUD",
    period: "Sep 2024 – Mar 2025",
    location: "Punjab, Pakistan",
    type: "Full-time",
    color: "from-emerald to-amber",
    points: [
      "Developed web applications using JavaScript and React frameworks",
      "Deployed applications on AWS, Azure and Heroku",
      "Managed Azure resources using Azure CLI & Portal",
      "Integrated CI/CD using GitHub Actions for streamlined delivery",
    ],
  },
  {
    role: "Cloud Engineer Intern",
    company: "TEVTA",
    period: "May 2025 – Aug 2025",
    location: "Punjab, Pakistan",
    type: "Internship",
    color: "from-amber to-rose",
    points: [
      "Explored core Azure services: compute, networking, storage, databases",
      "Understood cloud security measures and compliance standards",
      "Gained knowledge of Azure pricing and cost management strategies",
    ],
  },
  {
    role: "Front-end Developer",
    company: "CYBER METEORS",
    period: "May 2023 – Jan 2024",
    location: "Punjab, Pakistan",
    type: "Full-time",
    color: "from-rose to-primary",
    points: [
      "Developed secure, interactive web applications with React JS",
      "Built full stack web application from scratch including API integration",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-28 relative">
      <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full blur-[150px] opacity-20" style={{ background: "rgba(16, 185, 129, 0.15)" }} />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-emerald mb-4" style={{ background: "var(--bg-tertiary)" }}>
            MY JOURNEY
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Work <span className="gradient-text">Experience</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line with gradient */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent via-emerald to-amber opacity-30" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-8">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${exp.color} shadow-lg`} />
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2" />

                {/* Card */}
                <div className="ml-16 md:ml-0 md:w-1/2">
                  <div className="card p-6 rounded-2xl relative overflow-hidden group">
                    {/* Top gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${exp.color}`} />

                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-primary" style={{ background: "var(--bg-tertiary)" }}>
                        {exp.type}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>{exp.role}</h3>
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
