"use client";

import { cn } from "@/utils/cn";
import { CATEGORY_LABELS, ALL_CATEGORIES, type Category } from "@/config/tools";

interface CategoryFilterProps {
  active: Category | "all";
  onChange: (cat: Category | "all") => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const tabs: { key: Category | "all"; label: string }[] = [
    { key: "all", label: "All" },
    ...ALL_CATEGORIES.map((c) => ({
      key: c,
      label: toTitle(CATEGORY_LABELS[c]),
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
            active === tab.key
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function toTitle(s: string): string {
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
