'use client';

import { FileText, Scale, UserCheck, ShieldAlert } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = 'December 27, 2025';

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-10 text-white">
          <div className="mb-4 flex items-center gap-3">
            <Scale className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Terms of Service
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 p-8 text-slate-700 sm:p-12">
          {/* Section 1: Acceptance */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold uppercase tracking-wider text-sm">
                1. Acceptance of Terms
              </h2>
            </div>
            <p className="leading-relaxed">
              By accessing or using Access Tracker Pulse, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          {/* Section 2: Description of Service */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold uppercase tracking-wider text-sm">
                2. Description of Service
              </h2>
            </div>
            <p className="leading-relaxed">
              Access Tracker Pulse provides a platform for managing Google Drive folder permissions for marketing and lead generation purposes. This includes creating landing pages, capturing lead emails, and automatically updating Drive permissions via the Google Drive API.
            </p>
          </section>

          {/* Section 3: User Responsibilities */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <ShieldAlert className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold uppercase tracking-wider text-sm">
                3. User Responsibilities
              </h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 18 years old to use this service.</li>
              <li>You are responsible for maintaining the security of your account and Google OAuth tokens.</li>
              <li>You agree not to use the service for any illegal or unauthorized purposes, including spamming or unauthorized data collection.</li>
              <li>You are solely responsible for the content you share via Google Drive and the landing pages you create.</li>
            </ul>
          </section>

          {/* Section 4: Data Privacy */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-slate-900">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold uppercase tracking-wider text-sm">
                4. Data Privacy & Google Integration
              </h2>
            </div>
            <p className="leading-relaxed">
              Your use of the service is also governed by our Privacy Policy. By using the service, you consent to our collection and use of information as described therein. Note that our integration with Google is subject to Google&apos;s own Terms of Service and Privacy Policies.
            </p>
          </section>

          {/* Section 5: Disclaimer of Warranties */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <ShieldAlert className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold uppercase tracking-wider text-sm">
                5. Disclaimer of Warranties
              </h2>
            </div>
            <p className="leading-relaxed italic">
              The service is provided &ldquo;as is&rdquo; without any warranties of any kind, whether express or implied. We do not guarantee that the service will be uninterrupted or error-free.
            </p>
          </section>

          {/* Section 6: Contact */}
          <section className="mt-8 border-t border-slate-100 pt-8 text-center">
            <p className="text-sm text-slate-500">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2 font-bold text-slate-900">legal@accesstrackerpulse.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}