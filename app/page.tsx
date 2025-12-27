'use client';

import { useState } from 'react';
import { 
  ArrowRight, Check, ChevronLeft, ChevronRight, Menu, X, 
  Zap, TrendingUp, Users, Link2, BarChart3, Download, Database, 
  Shield, Lock, Globe, Rocket, FileText, Award, CheckCircle2, Star, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: ''
  });

  const trustedCompanies = [
    { name: 'TechCorp', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop&q=80' },
    { name: 'EduPlatform', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop&q=80' },
    { name: 'CreativeHub', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop&q=80' },
    { name: 'MarketPro', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop&q=80' },
    { name: 'GrowthLabs', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=80&fit=crop&q=80' }
  ];

  const features = [
    {
      icon: Link2,
      title: 'Public Landing Pages',
      description: 'Create custom access request pages that capture leads automatically while granting Drive permissions instantly.'
    },
    {
      icon: TrendingUp,
      title: 'A/B Testing Built-In',
      description: 'Test multiple variants per campaign and track which headlines and CTAs convert best.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Monitor conversion rates, growth trends, and campaign performance with beautiful dashboards.'
    },
    {
      icon: Database,
      title: 'Multi-Campaign Management',
      description: 'Run unlimited campaigns across different Drive folders with independent tracking.'
    },
    {
      icon: Zap,
      title: 'Instant Access Granting',
      description: 'Automatically grant Google Drive permissions the moment a lead requests access.'
    },
    {
      icon: Download,
      title: 'CRM-Ready Exports',
      description: 'Export all leads with campaign attribution and conversion data in CSV format.'
    }
  ];

  const useCases = [
    {
      icon: Rocket,
      title: 'Course Creators',
      description: 'Deliver courses via Drive while capturing student emails and tracking enrollment conversions.'
    },
    {
      icon: FileText,
      title: 'Template Sellers',
      description: 'Share Notion templates, spreadsheets, or design files with automatic lead capture.'
    },
    {
      icon: Users,
      title: 'Marketing Teams',
      description: 'Distribute whitepapers and resources while building your email list automatically.'
    },
    {
      icon: Award,
      title: 'Consultants',
      description: 'Share client deliverables and track engagement with professional access management.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Head of Growth',
      company: 'CourseLaunch Studio',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=200&h=200&fit=crop&auto=format&q=80',
      quote: 'Access Tracker Pulse automated our entire lead capture process. We went from manually adding 20 students per week to capturing 200+ leads automatically with zero effort.'
    },
    {
      name: 'David Chen',
      role: 'Founder',
      company: 'Template Marketplace',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=200&h=200&fit=crop&auto=format&q=80',
      quote: 'The A/B testing feature is incredible. We improved our conversion rate by 40% in just two weeks by testing different landing page variants.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      company: 'Growth Labs',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=200&h=200&fit=crop&auto=format&q=80',
      quote: 'Finally, a tool that makes Google Drive a real lead generation platform. The analytics dashboard shows exactly which campaigns work best.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Access Tracker Pulse</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 md:flex">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#use-cases" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Use Cases
              </a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Testimonials
              </a>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => (window.location.href = '/login')}
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => (window.location.href = '/login')}
              >
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
                <a href="#use-cases" className="text-sm font-medium text-gray-600">
                  Use Cases
                </a>
                <a href="#testimonials" className="text-sm font-medium text-gray-600">
                  Testimonials
                </a>
                <Button 
                  variant="ghost" 
                  className="justify-start"
                  onClick={() => (window.location.href = '/login')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-blue-600"
                  onClick={() => (window.location.href = '/login')}
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Turn Google Drive into your{' '}
                <span className="text-blue-600">lead generation engine</span>
              </h1>
              <p className="mb-8 text-lg text-gray-600 sm:text-xl">
                Capture leads automatically, track conversions with A/B testing, and grant Drive access instantly—all from beautiful landing pages that work 24/7.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-blue-600 text-base hover:bg-blue-700"
                  onClick={() => (window.location.href = '/login')}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Book a Demo
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Setup in 5 minutes</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-blue-100/50 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&q=80"
                  alt="Access Tracker Pulse Dashboard"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="border-y bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale">
            {trustedCompanies.map((_, index) => (
              <div key={index} className="h-12 w-32 rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Overview - Alternating Layout */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Feature 1 */}
          <div className="mb-32 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                <Link2 className="h-4 w-4" />
                Automated Lead Capture
              </div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Public landing pages that capture leads automatically
              </h2>
              <p className="mb-6 text-lg text-gray-600">
                Create custom landing pages where leads request access to your content. Drive permissions are granted instantly via API, and every lead is captured with full attribution tracking.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-gray-700">Custom URLs like yoursite.com/access/course-name</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-gray-700">Instant Drive permission granting via Google API</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-gray-700">Real-time Discord/email notifications for new leads</span>
                </li>
              </ul>
            </div>
            <div className="order-first lg:order-last">
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80"
                  alt="Public landing page example"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="mb-32 grid items-center gap-12 lg:grid-cols-2">
            <div className="order-last lg:order-first">
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&h=800&fit=crop&q=80"
                  alt="A/B testing dashboard"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                <TrendingUp className="h-4 w-4" />
                A/B Testing & Conversion Tracking
              </div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Test variants and optimize for maximum conversions
              </h2>
              <p className="mb-6 text-lg text-gray-600">
                Create multiple landing page variants per campaign. Test different headlines, CTAs, and copy to see what converts best. Track views vs. leads for every variant.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-gray-700">Unlimited A/B test variants per campaign</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-gray-700">Real-time conversion rate tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-gray-700">Compare performance across all variants</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                <BarChart3 className="h-4 w-4" />
                Real-Time Analytics
              </div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Beautiful dashboards that show what&apos;s working
              </h2>
              <p className="mb-6 text-lg text-gray-600">
                Monitor campaign performance with growth charts, conversion funnels, and lead source breakdowns. Export everything to CSV for your CRM or email marketing tools.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-gray-700">Growth charts and time-series analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-gray-700">Campaign performance comparison</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-gray-700">CSV export with full attribution data</span>
                </li>
              </ul>
            </div>
            <div className="order-first lg:order-last">
              <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop&q=80"
                  alt="Analytics dashboard"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefit Highlight */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-white">
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Stop manually managing Drive access. Start capturing leads automatically.
              </h2>
              <p className="mb-8 text-lg text-blue-100">
                Access Tracker Pulse eliminates the tedious work of manually granting Drive permissions and tracking who accessed what. Everything happens automatically, so you can focus on creating great content.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                  <div className="mb-2 text-4xl font-bold">200+</div>
                  <div className="text-blue-100">Leads captured per week</div>
                </div>
                <div className="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
                  <div className="mb-2 text-4xl font-bold">40%</div>
                  <div className="text-blue-100">Average conversion increase</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop&q=80"
                  alt="Team collaboration"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to automate lead generation
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features that work together seamlessly
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-gray-200 transition-all hover:border-blue-200 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-600">
                    <feature.icon className="h-6 w-6 text-blue-600 transition-colors group-hover:text-white" />
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

      {/* Security & Trust Section */}
      <section className="border-y bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              <Shield className="h-4 w-4" />
              Enterprise-Grade Security
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Your data is safe and secure
            </h2>
            <p className="text-lg text-gray-600">
              Built with privacy and security at the core
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">End-to-End Encryption</h3>
              <p className="text-gray-600">All sensitive data is encrypted at rest and in transit</p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">GDPR Compliant</h3>
              <p className="text-gray-600">Full compliance with data protection regulations</p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">Self-Hosted Option</h3>
              <p className="text-gray-600">Deploy on your own infrastructure for complete control</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries / Use Cases Section */}
      <section id="use-cases" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Built for creators and marketers
            </h2>
            <p className="text-lg text-gray-600">
              See how different teams use Access Tracker Pulse
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-gray-200 text-center">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                    <useCase.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section id="testimonials" className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
              <Star className="h-4 w-4 fill-current" />
              Customer Stories
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Loved by teams worldwide
            </h2>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <Card className="border-none shadow-xl">
              <CardContent className="p-8 sm:p-12">
                <div className="mb-6 flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-current" />
                  ))}
                </div>
                <p className="mb-8 text-xl text-gray-700">
                  &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-blue-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Dots Indicator */}
            <div className="mt-4 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentTestimonial ? 'w-8 bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Request a Demo / Signup Form */}
      <section id="demo" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="text-lg text-gray-600">
              Book a demo or start your free trial today
            </p>
          </div>

          <Card className="border-gray-200 shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <Input
                      id="role"
                      type="text"
                      placeholder="Marketing Manager"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Tell us about your use case..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="border-gray-300"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Request Demo
                  <Mail className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Or{' '}
                  <button
                    type="button"
                    onClick={() => (window.location.href = '/login')}
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    start your free trial instantly
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Clean Minimal Footer */}
      <footer className="border-t bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Access Tracker Pulse</span>
              </div>
              <p className="text-sm text-gray-600">
                Automate lead generation with Google Drive
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#features" className="hover:text-gray-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="hover:text-gray-900">
                    Use Cases
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-gray-900">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-gray-900">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/help" className="hover:text-gray-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#demo" className="hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Connect</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-gray-900">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-900">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-900">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Access Tracker Pulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
