import { ToolGrid } from "@/components/tools/ToolGrid";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
          Every tool you need to work<br className="hidden md:block" /> with PDFs in one place
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Every tool you need to use PDFs, at your fingertips. All are{" "}
          <span className="font-semibold text-gray-700">100% FREE</span> and easy to use!
          Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
        </p>
      </div>

      {/* Tool grid with category filter tabs */}
      <ToolGrid />
    </div>
  );
}
