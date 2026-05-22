import { motion } from "motion/react";
import { AbstractHeroGraphic } from "./AbstractHeroGraphic";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>Digital Growth for Local Businesses</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-slate-900 leading-tight mb-6">
            Establish Your Business with a Professional Website.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
            We build high-quality, affordable websites for local businesses in the Philippines. Build credibility, gain trust, and stand out online without the expensive agency price tag.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/get-started"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center space-x-2 group"
            >
              <span>Get Started</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/packages"
              className="w-full sm:w-auto px-8 py-4 bg-slate-50 text-slate-700 rounded-full font-medium hover:bg-slate-100 transition-colors flex items-center justify-center"
            >
              View Packages
            </Link>
          </div>
          <div className="mt-10 flex items-center space-x-6 text-sm font-medium text-slate-500">
            <div className="flex items-center">
              <CheckCircle2 size={16} className="text-blue-500 mr-2" />
              Fast Delivery
            </div>
            <div className="flex items-center">
              <CheckCircle2 size={16} className="text-blue-500 mr-2" />
              Affordable Pricing
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative lg:block"
        >
          <AbstractHeroGraphic />
        </motion.div>
      </div>
    </section>
  );
}
