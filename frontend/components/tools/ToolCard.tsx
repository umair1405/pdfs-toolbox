import Link from "next/link";
import type { Tool } from "@/config/tools";
import { ToolIcon } from "@/components/ui/ToolIcon";
import { cn } from "@/utils/cn";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/${tool.slug}`}
      className={cn(
        "group bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3",
        "hover:shadow-md hover:border-gray-300 transition-all",
        !tool.active && "opacity-75"
      )}
    >
      {/* Icon */}
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", tool.iconBg)}>
        <ToolIcon type={tool.iconType} size={26} className={tool.iconColor} />
      </div>

      {/* Text */}
      <div>
        <h3 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-primary mb-1">
          {tool.name}
          {!tool.active && (
            <span className="ml-2 text-[10px] font-semibold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
              Soon
            </span>
          )}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{tool.description}</p>
      </div>
    </Link>
  );
}
