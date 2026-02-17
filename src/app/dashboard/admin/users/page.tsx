import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function AdminUsersPage() {
  if (!(await isAdmin())) {
    redirect("/dashboard");
  }

  // In production, fetch from Supabase profiles table
  const mockUsers = [
    {
      id: "1",
      email: "admin@artfomo.com",
      full_name: "Admin User",
      role: "admin",
      created_at: "2026-01-15",
    },
    {
      id: "2",
      email: "collector@example.com",
      full_name: "Sarah Chen",
      role: "user",
      created_at: "2026-02-01",
    },
    {
      id: "3",
      email: "investor@example.com",
      full_name: "James Wright",
      role: "user",
      created_at: "2026-02-10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Manage Users</h1>
        <p className="mt-1 text-stone-500">
          {mockUsers.length} registered users.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-400">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-stone-900">{mockUsers.length}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-400">Admins</p>
          <p className="mt-2 text-3xl font-bold text-red-700">
            {mockUsers.filter((u) => u.role === "admin").length}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-400">Collectors</p>
          <p className="mt-2 text-3xl font-bold text-stone-900">
            {mockUsers.filter((u) => u.role === "user").length}
          </p>
        </div>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-left">
                <th className="px-6 py-3 font-semibold text-stone-500">User</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Email</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Role</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Joined</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-stone-100 last:border-0 hover:bg-stone-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
                        {user.full_name[0]}
                      </div>
                      <span className="font-medium text-stone-900">
                        {user.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-500">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.role === "admin" ? (
                      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-stone-500">{user.created_at}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === "user" ? (
                        <button className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50">
                          Make Admin
                        </button>
                      ) : (
                        <button className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50">
                          Remove Admin
                        </button>
                      )}
                    </div>
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
