'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6 rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Privacy Policy (Placeholder)
        </h1>
        <p className="text-sm text-slate-600">
          This page is a placeholder. Replace this content with your real
          Privacy Policy before launching to external users.
        </p>
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            This application connects to your Google Drive to read folder
            permissions and synchronize them with an internal access database.
            No files or file contents are read or stored; only metadata about
            who has access to a folder is processed.
          </p>
          <p>
            You can revoke this access at any time by removing the
            application&apos;s access from your Google Account security settings
            (&ldquo;Third-party access&rdquo;). After revocation, scheduled and manual sync
            operations will fail until access is granted again.
          </p>
          <p>
            Please consult with a legal professional to supply a proper Privacy
            Policy text that matches your jurisdiction and business model.
          </p>
        </div>
      </div>
    </div>
  );
}