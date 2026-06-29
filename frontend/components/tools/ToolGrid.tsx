"use client";

import { useState } from "react";
import { tools, type Category } from "@/config/tools";
import { CategoryFilter } from "@/components/tools/CategoryFilter";
import { ToolCard } from "@/components/tools/ToolCard";

export function ToolGrid() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");

  const visible = activeCategory === "all"
    ? tools
    : tools.filter((t) => t.category === activeCategory);

  return (
    <div>
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {visible.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
