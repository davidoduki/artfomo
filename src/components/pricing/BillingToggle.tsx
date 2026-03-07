"use client";

interface BillingToggleProps {
  isAnnual: boolean;
  onChange: (isAnnual: boolean) => void;
}

export function BillingToggle({ isAnnual, onChange }: BillingToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(false)}
        className={`text-sm font-medium transition-colors ${
          !isAnnual ? "text-stone-900" : "text-stone-400 hover:text-stone-600"
        }`}
      >
        Monthly
      </button>

      <button
        role="switch"
        aria-checked={isAnnual}
        onClick={() => onChange(!isAnnual)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          isAnnual ? "bg-stone-900" : "bg-stone-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            isAnnual ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>

      <button
        onClick={() => onChange(true)}
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
          isAnnual ? "text-stone-900" : "text-stone-400 hover:text-stone-600"
        }`}
      >
        Annual
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
          Save 25%
        </span>
      </button>
    </div>
  );
}
