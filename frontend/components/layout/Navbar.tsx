"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Grid } from "lucide-react";
import { tools, CATEGORY_LABELS, ALL_CATEGORIES, getToolsByCategory } from "@/config/tools";
import { ToolIcon } from "@/components/ui/ToolIcon";

export function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
        setConvertOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const convertFromTools = getToolsByCategory("convert_from_pdf");
  const convertToTools = getToolsByCategory("convert_to_pdf");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div ref={megaRef}>
        <nav className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-1">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 mr-4 flex-shrink-0">
            <span className="text-2xl font-bold text-primary leading-none">I</span>
            <span className="text-primary text-xl">&#9829;</span>
            <span className="text-2xl font-bold text-gray-800 leading-none">PDF</span>
          </Link>

          {/* Quick nav links */}
          <NavLink href="/merge_pdf">MERGE PDF</NavLink>
          <NavLink href="/split_pdf">SPLIT PDF</NavLink>
          <NavLink href="/compress_pdf">COMPRESS PDF</NavLink>

          {/* Convert PDF dropdown */}
          <div className="relative">
            <button
              onClick={() => { setConvertOpen((v) => !v); setMegaOpen(false); }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-primary rounded transition-colors whitespace-nowrap"
            >
              CONVERT PDF
              <ChevronDown size={14} className={convertOpen ? "rotate-180 text-primary" : ""} />
            </button>
            {convertOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-5 w-[480px] grid grid-cols-2 gap-6 z-50">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Convert TO PDF</p>
                  {convertToTools.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/${t.slug}`}
                      onClick={() => setConvertOpen(false)}
                      className="flex items-center gap-2.5 py-1.5 text-sm text-gray-700 hover:text-primary"
                    >
                      <span className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${t.iconBg}`}>
                        <ToolIcon type={t.iconType} size={14} />
                      </span>
                      {t.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Convert FROM PDF</p>
                  {convertFromTools.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/${t.slug}`}
                      onClick={() => setConvertOpen(false)}
                      className="flex items-center gap-2.5 py-1.5 text-sm text-gray-700 hover:text-primary"
                    >
                      <span className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${t.iconBg}`}>
                        <ToolIcon type={t.iconType} size={14} />
                      </span>
                      {t.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ALL PDF TOOLS mega dropdown */}
          <div className="relative">
            <button
              onClick={() => { setMegaOpen((v) => !v); setConvertOpen(false); }}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded transition-colors whitespace-nowrap ${megaOpen ? "text-primary" : "text-gray-700 hover:text-primary"}`}
            >
              ALL PDF TOOLS
              {megaOpen ? <ChevronUp size={14} className="text-primary" /> : <ChevronDown size={14} />}
            </button>

            {megaOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-6 w-[900px] max-w-[90vw]">
                <div className="grid grid-cols-4 gap-8">
                  {ALL_CATEGORIES.map((cat) => {
                    const catTools = getToolsByCategory(cat);
                    return (
                      <div key={cat}>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                          {CATEGORY_LABELS[cat]}
                        </p>
                        <div className="flex flex-col gap-0.5">
                          {catTools.map((t) => (
                            <Link
                              key={t.slug}
                              href={`/${t.slug}`}
                              onClick={() => setMegaOpen(false)}
                              className="flex items-center gap-2 py-1 text-sm text-gray-700 hover:text-primary group"
                            >
                              <span className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${t.iconBg}`}>
                                <ToolIcon type={t.iconType} size={12} />
                              </span>
                              <span className="group-hover:text-primary">{t.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* Auth */}
          <Link href="#" className="px-4 py-1.5 text-sm font-semibold text-gray-700 hover:text-primary">
            Login
          </Link>
          <Link
            href="#"
            className="px-4 py-1.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded transition-colors"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 text-sm font-semibold text-gray-700 hover:text-primary rounded transition-colors whitespace-nowrap"
    >
      {children}
    </Link>
  );
}
