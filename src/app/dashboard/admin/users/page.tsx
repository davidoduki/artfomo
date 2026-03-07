"use client";

import { useEffect, useState } from "react";
import type { UserRole, SubscriptionTier } from "@/lib/types";
import { TIER_LABELS } from "@/lib/subscription";

type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  subscription_tier: SubscriptionTier;
  created_at: string;
};

const ROLE_BADGE: Record<UserRole, string> = {
  admin:  "bg-red-50 text-red-700",
  editor: "bg-blue-50 text-blue-700",
  user:   "bg-stone-100 text-stone-600",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError(data.error ?? "Failed to load users.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Network error loading users.");
        setLoading(false);
      });
  }, []);

  const setRole = async (userId: string, role: UserRole) => {
    setUpdating(userId);
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: data.role } : u))
      );
    } else {
      alert(data.error ?? "Failed to update role.");
    }
    setUpdating(null);
  };

  const adminCount  = users.filter((u) => u.role === "admin").length;
  const editorCount = users.filter((u) => u.role === "editor").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Manage Users</h1>
        <p className="mt-1 text-stone-500">
          {loading ? "Loading…" : `${users.length} registered users`}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-400">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-stone-900">{users.length}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-400">Admins</p>
          <p className="mt-2 text-3xl font-bold text-red-700">{adminCount}</p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <p className="text-sm text-stone-400">Editors</p>
          <p className="mt-2 text-3xl font-bold text-blue-700">{editorCount}</p>
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
                <th className="px-6 py-3 font-semibold text-stone-500">Plan</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Joined</th>
                <th className="px-6 py-3 font-semibold text-stone-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                    Loading users…
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-stone-100 last:border-0 hover:bg-stone-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
                          {(user.full_name || user.email)[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-stone-900">
                          {user.full_name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${ROLE_BADGE[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-500 capitalize">
                      {TIER_LABELS[user.subscription_tier] ?? user.subscription_tier}
                    </td>
                    <td className="px-6 py-4 text-stone-500">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => setRole(user.id, "admin")}
                            disabled={updating === user.id}
                            className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50 disabled:opacity-50"
                          >
                            Make Admin
                          </button>
                        )}
                        {user.role !== "editor" && (
                          <button
                            onClick={() => setRole(user.id, "editor")}
                            disabled={updating === user.id}
                            className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
                          >
                            Make Editor
                          </button>
                        )}
                        {user.role !== "user" && (
                          <button
                            onClick={() => setRole(user.id, "user")}
                            disabled={updating === user.id}
                            className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:bg-stone-50 disabled:opacity-50"
                          >
                            Remove Role
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
