"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

const links = [
  { href: "/#home",       label: "Home" },
  { href: "/#about",      label: "About" },
  { href: "/#skills",     label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects",   label: "Projects" },
  { href: "/blog",        label: "Blog" },
  { href: "/#contact",    label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle }           = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const NavLink = ({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) => (
    <Link href={href} onClick={onClick}
      className="block px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-[var(--bg-tertiary)]"
      style={{ color: "var(--text-secondary)" }}>
      {label}
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : ""
      }`}
    >
      {/* Main bar */}
      <div className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/#home" className="text-xl font-bold gradient-text tracking-tight shrink-0">
          &lt;AM/&gt;
        </Link>

        {/* Desktop links — visible from md up */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href} label={l.label} />
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button onClick={toggle}
            className="p-2 rounded-xl transition-all hover:scale-110"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/#contact"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold hover:scale-105 transition-all duration-200">
            Hire Me
          </Link>
        </div>

        {/* Mobile right actions */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <button onClick={toggle}
            className="p-2 rounded-xl"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden px-4 pb-4"
          >
            <div className="glass rounded-2xl p-3 flex flex-col gap-1">
              {links.map((l) => (
                <NavLink key={l.href} href={l.href} label={l.label} onClick={() => setMobileOpen(false)} />
              ))}
              <Link href="/#contact" onClick={() => setMobileOpen(false)}
                className="mt-1 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold text-center">
                Hire Me
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
