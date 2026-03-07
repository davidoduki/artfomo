"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProfileProvider } from "@/context/ProfileContext";
import { TrialCountdownBanner } from "@/components/subscription/TrialCountdownBanner";
import { TIER_LABELS, TIER_ORDER } from "@/lib/subscription";
import type { Profile, SubscriptionTier } from "@/lib/types";

const userNav = [
  { label: "Overview",       href: "/dashboard",           icon: "grid"  },
  { label: "Watchlist",      href: "/dashboard/watchlist", icon: "eye"   },
  { label: "Saved Artists",  href: "/dashboard/saved",     icon: "heart" },
  { label: "Compare",        href: "/dashboard/compare",   icon: "sliders" },
  { label: "Profile",        href: "/dashboard/profile",   icon: "user"  },
];

const proNav = [
  { label: "Exhibitions",    href: "/dashboard/pro/exhibitions", icon: "image" },
];

const editorNav = [
  { label: "Manage Blog", href: "/dashboard/admin/blog", icon: "file-text" },
];

const adminNav = [
  { label: "Admin Overview", href: "/dashboard/admin",          icon: "shield"     },
  { label: "Manage Artists", href: "/dashboard/admin/artists",  icon: "users"      },
  { label: "Manage Drops",   href: "/dashboard/admin/drops",    icon: "zap"        },
  { label: "Manage Blog",    href: "/dashboard/admin/blog",     icon: "file-text"  },
  { label: "Manage Users",   href: "/dashboard/admin/users",    icon: "settings"   },
];

const TIER_BADGE_COLORS: Record<SubscriptionTier, string> = {
  free:      "bg-stone-100 text-stone-500",
  collector: "bg-blue-100 text-blue-700",
  advisor:   "bg-purple-100 text-purple-700",
  pro:       "bg-amber-100 text-amber-700",
};

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  const c = className || "h-4 w-4";
  switch (icon) {
    case "grid":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
        </svg>
      );
    case "eye":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "heart":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      );
    case "sliders":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="8" cy="6" r="2" fill="currentColor" stroke="none" />
          <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
          <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "user":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "image":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case "shield":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "users":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case "zap":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "file-text":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case "settings":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      );
    default:
      return null;
  }
}

export function DashboardShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tier = profile.subscription_tier ?? "free";
  const isProOrAdvisor = TIER_ORDER[tier] >= TIER_ORDER["advisor"];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/dashboard/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <ProfileProvider profile={profile}>
      <div className="min-h-screen bg-stone-50">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-stone-200 bg-white transition-transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-stone-200 px-6">
            <Link href="/" className="text-xl font-bold tracking-tight text-stone-900">
              Art<span className="text-red-700">FOMO</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1 text-stone-400 hover:text-stone-900 lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            {/* User section */}
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
              My Dashboard
            </p>
            <div className="space-y-1">
              {userNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive(item.href)
                      ? "bg-stone-900 text-white"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  <NavIcon icon={item.icon} />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Pro/Advisor features */}
            {isProOrAdvisor && (
              <>
                <div className="my-4 border-t border-stone-200" />
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
                  {TIER_LABELS[tier]} Features
                </p>
                <div className="space-y-1">
                  {proNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive(item.href)
                          ? "bg-stone-900 text-white"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      <NavIcon icon={item.icon} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Upgrade nudge for free/collector users */}
            {TIER_ORDER[tier] < TIER_ORDER["advisor"] && (
              <>
                <div className="my-4 border-t border-stone-200" />
                <Link
                  href="/pricing"
                  className="mx-1 flex items-center gap-2 rounded-lg border border-dashed border-stone-300 px-3 py-2.5 text-sm text-stone-500 transition hover:border-stone-400 hover:text-stone-700"
                >
                  <span>⬆</span>
                  Upgrade plan
                </Link>
              </>
            )}

            {/* Editor section */}
            {profile.role === "editor" && (
              <>
                <div className="my-4 border-t border-stone-200" />
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
                  Editor
                </p>
                <div className="space-y-1">
                  {editorNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive(item.href)
                          ? "bg-stone-900 text-white"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      <NavIcon icon={item.icon} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Admin section */}
            {profile.role === "admin" && (
              <>
                <div className="my-4 border-t border-stone-200" />
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
                  Admin
                </p>
                <div className="space-y-1">
                  {adminNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                        isActive(item.href)
                          ? "bg-red-700 text-white"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      <NavIcon icon={item.icon} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </nav>

          {/* User profile footer */}
          <div className="border-t border-stone-200 p-4">
            <div className="mb-3 flex items-center gap-3">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-9 w-9 rounded-full" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-sm font-semibold text-stone-600">
                  {(profile.full_name || profile.email)[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-stone-900">
                  {profile.full_name || "User"}
                </p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TIER_BADGE_COLORS[tier]}`}
                >
                  {TIER_LABELS[tier]}
                </span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-stone-200 bg-white/90 px-6 backdrop-blur-md">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-stone-500 hover:text-stone-900 lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <div className="flex-1" />
            <Link href="/pricing" className="text-sm text-stone-400 hover:text-stone-700 transition">
              Pricing
            </Link>
            <Link href="/artists" className="text-sm text-stone-500 hover:text-stone-900 transition">
              View Site &rarr;
            </Link>
          </header>

          {/* Trial countdown banner (shows only if trialing) */}
          <TrialCountdownBanner />

          {/* Page content */}
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProfileProvider>
  );
}
