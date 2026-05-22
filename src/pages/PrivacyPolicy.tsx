import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold font-display text-slate-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p>At Nexus Media, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your information.</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Information We Collect</h2>
          <p>We only collect information necessary to provide our website development services, including your name, business details, and contact information.</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How We Use Your Information</h2>
          <p>Your information is used strictly to communicate with you, develop your website, and provide ongoing support. We do not sell or share your data with third parties.</p>
          
          <p className="mt-8">For any concerns, please contact us at <a href="mailto:nexusmediaphilippines@gmail.com" className="text-blue-600 hover:underline">nexusmediaphilippines@gmail.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
