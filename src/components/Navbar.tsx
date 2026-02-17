export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-stone-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a href="/" className="text-xl font-bold tracking-tight text-stone-900">
          Art<span className="text-red-700">FOMO</span>
        </a>
        <div className="flex items-center gap-6">
          <a
            href="/artists"
            className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
          >
            Directory
          </a>
          <a
            href="/blog"
            className="text-sm font-medium text-stone-500 transition hover:text-stone-900"
          >
            Blog
          </a>
          <a
            href="/login"
            className="rounded-full bg-stone-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Sign In
          </a>
        </div>
      </div>
    </nav>
  );
}
