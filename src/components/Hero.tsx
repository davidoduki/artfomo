export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Gradient background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-rose-900/20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-6 pt-32 pb-24 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-purple-300 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          Live market signals — updated daily
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl leading-[1.1]">
          Don&apos;t Miss the Next{" "}
          <span className="bg-gradient-to-r from-purple-400 to-rose-400 bg-clip-text text-transparent">
            Basquiat
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl leading-relaxed">
          ArtFOMO is the data-driven directory of hot emerging artists, limited
          drops, and market momentum — built for collectors and investors who
          move early.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#waitlist"
            className="inline-flex h-12 items-center rounded-full bg-gradient-to-r from-purple-600 to-rose-500 px-8 text-base font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:shadow-purple-500/40 hover:scale-[1.02]"
          >
            Get Early Access
          </a>
          <a
            href="#features"
            className="inline-flex h-12 items-center rounded-full border border-white/15 bg-white/5 px-8 text-base font-medium text-zinc-300 backdrop-blur transition hover:bg-white/10"
          >
            See Today&apos;s Trending Artists
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            "Built from marketplace signals, gallery activity, and collector demand",
            "Updated daily with real-time momentum tracking",
            "Designed for collectors, advisors, and art-curious investors",
          ].map((text) => (
            <div
              key={text}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-zinc-400 backdrop-blur"
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
