'use client';

import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Menu, X, Zap, Shield, TrendingUp, Users, Target, Clock, Link, BarChart3, Download, Database, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Link,
      title: 'Public Access Landing Pages',
      description:
        'Create custom landing pages (/access/[slug]) where leads request access. Drive permissions are granted automatically via API.',
    },
    {
      icon: TrendingUp,
      title: 'A/B Testing & Conversion Tracking',
      description:
        'Test multiple variants per campaign to optimize headlines and CTAs. Track views vs. leads to measure conversion performance.',
    },
    {
      icon: Users,
      title: 'Automated Lead Capture',
      description:
        'Capture leads from public access requests AND sync existing Drive permissions. Real-time Discord notifications for new leads.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description:
        'Growth charts, campaign performance metrics, conversion rates, lead source breakdown, and time-series analytics.',
    },
    {
      icon: Database,
      title: 'Multi-Campaign Management',
      description:
        'Manage unlimited campaigns, each linked to different Drive folders, with independent tracking and analytics.',
    },
    {
      icon: Download,
      title: 'CRM Export Ready',
      description:
        'Export all leads with campaign attribution, conversion data, and timestamps. CSV format ready for any CRM or email tool.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Ops Lead',
      company: 'CourseLaunch Studio',
      image: '/api/placeholder/100/100',
      quote:
        'Automated 200+ leads in the first week with zero manual work. The A/B testing feature helped us improve conversion by 40%.',
    },
    {
      name: 'David Chen',
      role: 'Founder',
      company: 'Notion for Notaries',
      image: '/api/placeholder/100/100',
      quote:
        "Finally, a tool that grants Drive access automatically while tracking conversions. The analytics dashboard shows exactly which campaigns perform best.",
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      company: 'Growth Labs',
      image: '/api/placeholder/100/100',
      quote:
        'The public landing pages capture leads 24/7, and the automated access granting means I never touch Drive manually. Conversion tracking shows what works.',
    },
  ];

  const faqs = [
    {
      question: 'How does the automated access granting work?',
      answer:
        'When a lead requests access on your public landing page, Access Tracker Pulse automatically grants them viewer access to your Google Drive folder via the Drive API. The process is instant and requires no manual intervention.',
    },
    {
      question: 'Can I A/B test different landing page variants?',
      answer:
        'Yes! Each campaign supports multiple variants (A/B, C, etc.) with different headlines, CTAs, and descriptions. The system tracks views and conversions per variant so you can see which performs best.',
    },
    {
      question: 'What conversion data is tracked?',
      answer:
        'We track views (landing page visits), leads (access requests), conversion rates, campaign attribution, timestamps, and lead sources (public request vs. Drive sync). All data is exportable to CSV.',
    },
    {
      question: 'Can I sync existing Google Drive permissions to capture leads?',
      answer:
        'Yes! The sync feature scans your Drive folders and captures leads who already have access. This lets you build your lead database from both new requests and existing Drive permissions.',
    },
    {
      question: 'How do I create a public landing page for my campaign?',
      answer:
        'Create a campaign in the dashboard, and it automatically generates a landing page at `/access/[slug]`. Share this URL anywhere – social media, email, ads – and leads can request access instantly.',
    },
    {
      question: 'Can I export leads to my CRM or email marketing tool?',
      answer:
        'Yes. Export all leads to CSV with campaign attribution, conversion data, timestamps, and source information. The format is compatible with most CRMs and email marketing platforms.',
    },
    {
      question: 'Is this self-hosted or a managed SaaS?',
      answer:
        'This repo is built to be self-hosted. You can deploy it to your own infrastructure (e.g. Vercel + Turso) and keep full control of your data and lead information.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Access Tracker Pulse</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 md:flex">
              <a href="#features" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                Pricing
              </a>
              <a href="#faq" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                FAQ
              </a>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-900" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="border-t py-4 md:hidden">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-sm font-medium text-gray-600">
                  Features
                </a>
                <a href="#pricing" className="text-sm font-medium text-gray-600">
                  Pricing
                </a>
                <a href="#faq" className="text-sm font-medium text-gray-600">
                  FAQ
                </a>
                <Button variant="ghost" className="justify-start">
                  Sign In
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
        </div>

        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                <Sparkles className="h-4 w-4" />
                Automated lead generation platform
              </div>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Turn Google Drive into
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}
                  an automated lead generation machine
                </span>
              </h1>
              <p className="mb-8 text-lg text-gray-600 sm:text-xl">
                Create public landing pages, automatically grant Drive access when leads request it, track conversions with A/B testing, and get real-time analytics – all fully automated.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-base hover:from-blue-700 hover:to-purple-700"
                  onClick={() => (window.location.href = '/')}
                >
                  Open Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base"
                  onClick={() => (window.location.href = '/README_PRO')}
                >
                  View Setup Guide
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Fully automated • A/B testing included • Real-time conversion tracking • Zero manual work required
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
                  alt="Dashboard Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              How Access Tracker Pulse Works
            </h2>
            <p className="text-lg text-gray-600">
              From campaign setup to lead capture and conversion tracking – all fully automated.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Connect Google Drive
              </h3>
              <p className="text-gray-600">
                Sign in with Google and approve Drive access for automated permission granting.
              </p>
              {/* Connector line for desktop */}
              <div className="absolute left-full top-8 hidden h-0.5 w-full bg-gradient-to-r from-blue-300 to-purple-300 lg:block" />
            </div>

            <div className="relative text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Create Campaigns
              </h3>
              <p className="text-gray-600">
                Set up campaigns with custom landing pages (/access/[slug]) and optionally create A/B test variants.
              </p>
              {/* Connector line for desktop */}
              <div className="absolute left-full top-8 hidden h-0.5 w-full bg-gradient-to-r from-purple-300 to-pink-300 lg:block" />
            </div>

            <div className="relative text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Share & Capture Leads
              </h3>
              <p className="text-gray-600">
                Share your landing page URL; leads request access, and Drive permissions are granted automatically.
              </p>
              {/* Connector line for desktop */}
              <div className="absolute left-full top-8 hidden h-0.5 w-full bg-gradient-to-r from-pink-300 to-orange-300 lg:block" />
            </div>

            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-2xl font-bold text-white shadow-lg">
                4
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Track & Analyze
              </h3>
              <p className="text-gray-600">
                View conversion rates, campaign performance, growth charts, and export leads to CSV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Built for automated lead generation & conversion tracking
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to capture leads, track conversions, run A/B tests, and grow your audience automatically.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-none bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 transition-transform group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Loved by teams who live in Google Drive
            </h2>
            <p className="text-lg text-gray-600">
              See how Access Tracker Pulse helps creators and operators stay in control of access.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-6 text-gray-700">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-400">
                      <img
                        src={`https://i.pravatar.cc/150?img=${index + 1}`}
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Use it internally, or as a SaaS for your clients
            </h2>
            <p className="text-lg text-gray-600">
              Start with an internal “ops” deployment and grow into a multi‑campaign lead tracker.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200 bg-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Internal</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="mb-6 text-gray-600">
                  Perfect for using Access Tracker Pulse as a private internal tool.
                </p>
                <ul className="mb-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 shrink-0 text-green-500" />
                    <span className="text-gray-700">Single workspace, manual sync</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 shrink-0 text-green-500" />
                    <span className="text-gray-700">Access dashboard & CSV export</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 shrink-0 text-green-500" />
                    <span className="text-gray-700">Email/Discord alerts (manual setup)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 shrink-0 text-green-500" />
                    <span className="text-gray-700">Great for ops, RevOps, and security teams</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" size="lg">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-2 border-blue-500 bg-white shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-bold text-white">
                  MOST POPULAR
                </span>
              </div>
              <CardContent className="p-8">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Creator / Team</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$12</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="mb-6 text-gray-600">
                  For creators and teams who want campaign‑level insights and automation.
                </p>
                <ul className="mb-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 shrink-0 text-green-500" />
                    <span className="text-gray-700">
                      <strong>Unlimited goals</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 shrink-0 text-green-500" />
                    <span className="text-gray-700">
                      Campaign analytics & growth insights
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 shrink-0 text-green-500" />
                    <span className="text-gray-700">Multi‑campaign & multi‑workspace support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 shrink-0 text-green-500" />
                    <span className="text-gray-700">Scheduled and cron‑based sync</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 shrink-0 text-green-500" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-6 w-6 shrink-0 text-green-500" />
                    <span className="text-gray-700">Export, webhooks & integrations</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about using Access Tracker Pulse with Google Drive
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  className="flex w-full items-center justify-between p-6 text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to automate your lead generation?
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            Join creators who capture leads automatically, track conversions with A/B testing, and grant access instantly – all with zero manual work.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-white text-lg text-blue-600 hover:bg-gray-100"
              onClick={() => (window.location.href = '/')}
            >
              Open Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent text-lg text-white hover:bg-white/10"
            >
              Schedule a Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-blue-100">
            Self-hosted by you • Uses your own Google Cloud project • Turn off access anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-900 px-4 py-12 text-gray-400 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Access Tracker Pulse</span>
              </div>
              <p className="text-sm">
                Helping you see and control who can access your Google Drive content.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-white">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 Access Tracker Pulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
