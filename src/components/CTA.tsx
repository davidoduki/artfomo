"use client";

export default function CTA() {
  return (
    <section
      id="waitlist"
      className="relative overflow-hidden bg-zinc-950 py-24 text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Get early access to the art world&apos;s fastest-moving signals
        </h2>
        <p className="mt-4 text-lg text-zinc-400">
          Join the ArtFOMO waitlist today.
        </p>

        <form
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="your@email.com"
            required
            className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 backdrop-blur"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-purple-600 to-rose-500 px-8 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:shadow-purple-500/40 hover:scale-[1.02]"
          >
            Request Access
          </button>
        </form>
      </div>
    </section>
  );
}
