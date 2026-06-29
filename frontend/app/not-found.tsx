import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <p className="text-7xl font-extrabold text-gray-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8">
        The tool or page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
      >
        Back to all tools
      </Link>
    </div>
  );
}
