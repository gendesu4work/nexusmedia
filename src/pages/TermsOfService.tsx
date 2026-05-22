import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold font-display text-slate-900 mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p>Welcome to Nexus Media. By engaging our services, you agree to these Terms of Service.</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Service Delivery</h2>
          <p>We provide website development services as outlined in our packages. Timelines depend on you providing necessary business information and prompt feedback.</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Payment Terms</h2>
          <p>Pricing is transparent and outlined prior to starting the project. Subscriptions for maintenance are billed monthly and can be paused or cancelled at any time.</p>
          
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Ownership</h2>
          <p>Upon final payment, you own the website assets created for your business.</p>
        </div>
      </div>
    </div>
  );
}
