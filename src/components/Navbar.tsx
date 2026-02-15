export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <a href="/" className="text-xl font-bold text-white">
          Art<span className="text-purple-400">FOMO</span>
        </a>
        <a
          href="#waitlist"
          className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Get Early Access
        </a>
      </div>
    </nav>
  );
}
