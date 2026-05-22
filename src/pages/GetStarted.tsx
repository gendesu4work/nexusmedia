import { motion } from "motion/react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";

export function GetStarted() {
  const [searchParams] = useSearchParams();
  const selectedPackage = searchParams.get("package") || "Not sure yet";

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900 mb-4">
              Let's Build Your Website
            </h1>
            <p className="text-slate-600">
              Fill out the form below and we'll get back to you within 24 hours to discuss your new online presence.
            </p>
          </div>

          <form
            className="space-y-6"
            action="https://api.web3forms.com/submit"
            method="POST"
          >
            <input
              type="hidden"
              name="access_key"
              value={import.meta.env.VITE_WEB3FORMS_KEY}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Juan Dela Cruz"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Business Name</label>
                <input
                  type="text"
                  name="business"
                  placeholder="Juan's Cafe"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="juan@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="0912 345 6789"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Interested Package</label>
              <select
                name="package"
                defaultValue={selectedPackage}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors appearance-none"
              >
                <option value="Not sure yet">I'm not sure yet, let's discuss</option>
                <option value="Starter Online Presence">Starter Online Presence (₱2,500)</option>
                <option value="Business Website">Business Website (₱7,000)</option>
                <option value="Professional Growth Website">Professional Growth Website (₱15,000)</option>
                <option value="Business Growth & Maintenance">Business Growth & Maintenance Plan</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900">Tell us a bit about your business (Optional)</label>
              <textarea
                rows={4}
                name="message"
                placeholder="What products or services do you offer?"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-none"
              ></textarea>
            </div>

            <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center space-x-2">
              <Send size={18} />
              <span>Send Inquiry</span>
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
