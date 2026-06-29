import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Product</h5>
            <Link href="/" className="block text-sm text-gray-600 hover:text-primary py-1">All tools</Link>
            <Link href="#" className="block text-sm text-gray-600 hover:text-primary py-1">Pricing</Link>
            <Link href="#" className="block text-sm text-gray-600 hover:text-primary py-1">API</Link>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Company</h5>
            <Link href="#" className="block text-sm text-gray-600 hover:text-primary py-1">About</Link>
            <Link href="#" className="block text-sm text-gray-600 hover:text-primary py-1">Blog</Link>
            <Link href="#" className="block text-sm text-gray-600 hover:text-primary py-1">Careers</Link>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Resources</h5>
            <Link href="#" className="block text-sm text-gray-600 hover:text-primary py-1">Docs</Link>
            <Link href="#" className="block text-sm text-gray-600 hover:text-primary py-1">Support</Link>
          </div>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Legal</h5>
            <Link href="#" className="block text-sm text-gray-600 hover:text-primary py-1">Privacy</Link>
            <Link href="#" className="block text-sm text-gray-600 hover:text-primary py-1">Terms</Link>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © PDF Toolbox 2026 — Your PDF Editor
        </div>
      </div>
    </footer>
  );
}
