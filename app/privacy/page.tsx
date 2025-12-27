'use client';

import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = 'December 27, 2025';

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-row max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-10 text-white">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Privacy Policy
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 p-8 text-slate-700 sm:p-12">
          {/* Section 1: Intro */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Eye className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold uppercase tracking-wider text-sm">
                Introduction
              </h2>
            </div>
            <p className="leading-relaxed">
              At Access Tracker Pulse, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service, particularly in relation to our integration with Google APIs.
            </p>
          </section>

          {/* Section 2: Google Data Usage */}
          <section className="space-y-4 rounded-xl bg-blue-50/50 p-6 border border-blue-100">
            <div className="flex items-center gap-2 text-slate-900">
              <Lock className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold uppercase tracking-wider text-sm">
                Google API Disclosure
              </h2>
            </div>
            <p className="font-medium text-slate-900">
              Access Tracker Pulse&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
              <a 
                href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google API Services User Data Policy
              </a>, including the Limited Use requirements.
            </p>
            <div className="space-y-4 pt-2">
              <div className="flex gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Scopes Used</h3>
                  <p className="text-sm">We use the <code>https://www.googleapis.com/auth/drive</code> scope to manage permissions of specific folders you select for your campaigns.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Data Minimization</h3>
                  <p className="text-sm">We do not read, download, or store the content of your files. We only process folder metadata and permission lists to facilitate lead access management.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">No Data Selling</h3>
                  <p className="text-sm">We never sell your Google user data to third parties. Data is used strictly for provide and improving the core features of the application.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Data We Collect */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-slate-900">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2 className="font-bold uppercase tracking-wider text-sm">
                Data We Collect
              </h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and profile picture provided by Google OAuth.</li>
              <li><strong>Campaign Data:</strong> Folder IDs and lead emails you capture through our landing pages.</li>
              <li><strong>Usage Information:</strong> Logs of synchronization events and conversion analytics.</li>
            </ul>
          </section>

          {/* Section 4: Contact */}
          <section className="mt-8 border-t border-slate-100 pt-8 text-center">
            <p className="text-sm text-slate-500">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2 font-bold text-slate-900">support@accesstrackerpulse.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}