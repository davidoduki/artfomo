"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this updates the Supabase profile
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Profile Settings</h1>
        <p className="mt-1 text-stone-500">Manage your account information.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">Personal Info</h2>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Email
              </label>
              <input
                type="email"
                disabled
                placeholder="your@email.com"
                className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-500"
              />
              <p className="mt-1 text-xs text-stone-400">
                Email is managed through your Google account.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">Preferences</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <span className="text-sm text-stone-700">
                Email me when a watched artist has a new drop
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <span className="text-sm text-stone-700">
                Email me weekly momentum reports
              </span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <span className="text-sm text-stone-700">
                Email me about new blog posts
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Save Changes
          </button>
          {saved && (
            <span className="text-sm text-green-700">Changes saved!</span>
          )}
        </div>
      </form>

      {/* Danger zone */}
      <div className="mt-12 rounded-xl border border-red-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-stone-500">
          Permanently delete your account and all associated data.
        </p>
        <button className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50">
          Delete Account
        </button>
      </div>
    </div>
  );
}
