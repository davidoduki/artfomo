export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-[#fafaf8] py-10 text-center text-sm text-stone-400">
      <div className="mx-auto max-w-5xl px-6">
        <p className="font-semibold text-stone-900">
          Art<span className="text-red-700">FOMO</span>
        </p>
        <p className="mt-2">
          The data trove for collectors and investors who want to spot rising
          artists before they hit the headlines.
        </p>
        <p className="mt-4">&copy; {new Date().getFullYear()} ArtFOMO. All rights reserved.</p>
      </div>
    </footer>
  );
}
