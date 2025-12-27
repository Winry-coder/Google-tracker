'use client';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6 rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          How This App Works
        </h1>
        <p className="text-sm text-slate-600">
          This page gives creators a plain-language overview of what the app
          does, why it needs Google Drive access, and how to disconnect it.
        </p>
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="mb-1 text-base font-semibold text-slate-900">
              1. What the app does
            </h2>
            <p>
              Access Tracker Pulse connects to one or more Google Drive folders
              that you choose and keeps an internal list of people who have
              access. It turns your shared folders into &ldquo;campaigns&rdquo; so you can
              see who requested access, who currently has it, and basic
              statistics about your leads.
            </p>
          </section>

          <section>
            <h2 className="mb-1 text-base font-semibold text-slate-900">
              2. Why it needs Google Drive access
            </h2>
            <p>
              When you sign in with Google, the app receives permission to read
              and manage permissions on the specific Drive folders you attach
              to campaigns. It does <strong>not</strong> read file contents;
              it only reads permission lists (who has access) and updates those
              lists when you approve or revoke access from the dashboard.
            </p>
          </section>

          <section>
            <h2 className="mb-1 text-base font-semibold text-slate-900">
              3. How to disconnect or revoke access
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Go to your Google Account &gt; <strong>Security</strong>.
              </li>
              <li>
                Find the section called <strong>&ldquo;Third-party access&rdquo;</strong>
                or <strong>&ldquo;Apps with access to your account&rdquo;</strong>.
              </li>
              <li>
                Locate this app by name and choose
                <strong> Remove access</strong>.
              </li>
            </ol>
            <p className="mt-2">
              After you revoke access, scheduled and manual syncs will stop
              working until you sign in again and reconnect a folder.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}