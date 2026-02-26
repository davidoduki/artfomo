import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { artists } from "@/data/artists";

export default async function AdminOverviewPage() {
  if (!(await isAdmin())) {
    redirect("/dashboard");
  }

  const totalDrops = artists.reduce((sum, a) => sum + a.recentDrops.length, 0);
  const soldOutDrops = artists.reduce(
    (sum, a) => sum + a.recentDrops.filter((d) => d.soldOut).length,
    0
  );

  const stats = [
    { label: "Total Artists", value: artists.length, href: "/dashboard/admin/artists" },
    { label: "Total Drops", value: totalDrops, href: "/dashboard/admin/drops" },
    { label: "Sold Out Drops", value: soldOutDrops, href: "/dashboard/admin/drops" },
    { label: "Blog Posts", value: 0, href: "/dashboard/admin/blog" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Admin Dashboard</h1>
        <p className="mt-1 text-stone-500">
          Manage your platform content and monitor performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-sm"
          >
            <p className="text-sm text-stone-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-stone-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/admin/blog/new"
            className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-stone-900">New Blog Post</p>
              <p className="text-sm text-stone-400">Write and publish content</p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/artists"
            className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-stone-900">Manage Artists</p>
              <p className="text-sm text-stone-400">Edit artist profiles and data</p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/drops"
            className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 transition hover:border-stone-300 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-stone-900">Manage Drops</p>
              <p className="text-sm text-stone-400">Track and update art drops</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent activity - momentum leaders */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">
          Top Momentum Artists
        </h2>
        <div className="mt-4 rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                <th className="px-6 py-3 font-semibold text-stone-500">Artist</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Medium</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Score</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {artists
                .sort((a, b) => b.momentumScore - a.momentumScore)
                .slice(0, 5)
                .map((artist) => (
                  <tr
                    key={artist.slug}
                    className="border-b border-stone-100 last:border-0"
                  >
                    <td className="px-6 py-3 font-medium text-stone-900">
                      {artist.name}
                    </td>
                    <td className="px-6 py-3 text-stone-500">{artist.medium}</td>
                    <td className="px-6 py-3 font-bold text-stone-900">
                      {artist.momentumScore}
                    </td>
                    <td className="px-6 py-3">
                      <span className="capitalize text-stone-500">
                        {artist.momentum}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
