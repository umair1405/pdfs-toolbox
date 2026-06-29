import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, tools } from "@/config/tools";
import { ToolUploadPage } from "@/components/tools/ToolUploadPage";
import { ToolIcon } from "@/components/ui/ToolIcon";
import Link from "next/link";

interface PageProps {
  params: Promise<{ tool: string }>;
}

/* Pre-generate every known tool slug at build time */
export function generateStaticParams() {
  return tools.map((t) => ({ tool: t.slug }));
}

/* Per-tool SEO metadata */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tool } = await params;
  const toolData = getToolBySlug(tool);

  if (!toolData) {
    return { title: "Tool not found" };
  }

  return {
    title: `${toolData.pageTitle} — PDF Toolbox`,
    description: toolData.pageSubtitle,
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { tool } = await params;
  const toolData = getToolBySlug(tool);

  if (!toolData) notFound();

  const related = tools
    .filter(
      (t) =>
        t.category === toolData.category &&
        t.slug !== toolData.slug
    )
    .slice(0, 6);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary">
            All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">
            {toolData.name}
          </span>
        </div>
      </div>

      {/* Upload UI */}
      <div className="bg-gray-50 min-h-[500px]">
        <ToolUploadPage tool={toolData} />
      </div>

      {/* Related tools */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="text-lg font-bold text-gray-700 mb-5">
            Related tools
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center gap-2 text-center hover:shadow-md hover:border-gray-300 transition-all group"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${t.iconBg}`}
                >
                  <ToolIcon
                    type={t.iconType}
                    size={22}
                    className={t.iconColor}
                  />
                </div>

                <span className="text-xs font-semibold text-gray-700 group-hover:text-primary leading-snug">
                  {t.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}