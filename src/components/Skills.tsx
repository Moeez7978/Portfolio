"use client";
import { motion } from "framer-motion";
import { Cloud, Code, Server, Users, Database, Terminal, Globe, Cpu } from "lucide-react";

const skillCategories = [
  {
    title: "Cloud Platforms",
    icon: Cloud,
    color: "from-primary to-primary-light",
    iconColor: "text-primary",
    skills: [
      { name: "AWS (EC2, S3, VPC, IAM)", level: 85 },
      { name: "Microsoft Azure", level: 75 },
      { name: "Cloud Infrastructure", level: 80 },
    ],
  },
  {
    title: "DevOps & Automation",
    icon: Terminal,
    color: "from-accent to-accent-light",
    iconColor: "text-accent",
    skills: [
      { name: "Docker & Containers", level: 85 },
      { name: "CI/CD (GitHub Actions)", level: 90 },
      { name: "Linux Administration", level: 80 },
      { name: "Kubernetes", level: 50 },
    ],
  },
  {
    title: "Frontend Development",
    icon: Globe,
    color: "from-emerald to-emerald",
    iconColor: "text-emerald",
    skills: [
      { name: "React.js", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "Tailwind CSS", level: 90 },
    ],
  },
  {
    title: "Backend & Databases",
    icon: Database,
    color: "from-amber to-amber",
    iconColor: "text-amber",
    skills: [
      { name: "Node.js & Express", level: 85 },
      { name: "REST APIs", level: 90 },
      { name: "SQL & NoSQL", level: 75 },
      { name: "Git & Version Control", level: 90 },
    ],
  },
];

const softSkills = [
  { icon: Users, label: "Customer-focused", color: "text-primary" },
  { icon: Cpu, label: "Problem Solver", color: "text-accent" },
  { icon: Code, label: "Effective Communicator", color: "text-emerald" },
  { icon: Server, label: "Highly Adaptable", color: "text-amber" },
];

export default function Skills() {
  return (
    <section id="skills" className="py-28 relative">
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[150px] opacity-20" style={{ background: "rgba(99, 102, 241, 0.15)" }} />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-accent mb-4" style={{ background: "var(--bg-tertiary)" }}>
            WHAT I DO
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            My <span className="gradient-text">Skills</span>
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
            A versatile toolkit spanning cloud, DevOps, and full-stack development
          </p>
        </motion.div>

        {/* Technical Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 rounded-2xl group"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${cat.color} bg-opacity-10`} style={{ background: "var(--bg-tertiary)" }}>
                  <cat.icon size={20} className={cat.iconColor} />
                </div>
                <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>{cat.title}</h3>
              </div>
              <div className="space-y-4">
                {cat.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{skill.name}</span>
                      <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Soft Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {softSkills.map((s, i) => (
            <div key={i} className="card p-5 rounded-xl text-center group cursor-default">
              <s.icon size={24} className={`${s.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
              <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
