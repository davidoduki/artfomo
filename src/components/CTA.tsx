"use client";

export default function CTA() {
  return (
    <section
      id="waitlist"
      className="border-t border-stone-200 bg-white py-24"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          Get early access to the art world&apos;s fastest-moving signals
        </h2>
        <p className="mt-4 text-lg text-stone-500">
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
            className="flex-1 rounded-full border border-stone-300 bg-white px-5 py-3 text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
          />
          <button
            type="submit"
            className="rounded-full bg-stone-900 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-stone-800 hover:shadow-lg"
          >
            Request Access
          </button>
        </form>
      </div>
    </section>
  );
}
