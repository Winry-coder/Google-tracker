'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6 rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Terms of Service (Placeholder)
        </h1>
        <p className="text-sm text-slate-600">
          This page is a placeholder. Replace this content with your real
          Terms of Service before launching to external users.
        </p>
        <div className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            By using this application, your users grant it permission to manage
            access to specific Google Drive folders that you configure as
            campaigns. The application may add or remove people from those
            folders based on your settings.
          </p>
          <p>
            You are responsible for ensuring that your use of this application
            complies with applicable laws and Google&apos;s Terms of Service. You
            should clearly disclose to your end users what data is collected
            and how it is used.
          </p>
          <p>
            Please consult with a legal professional to supply a proper Terms
            of Service text that matches your jurisdiction and business model.
          </p>
        </div>
      </div>
    </div>
  );
}