import { Share2 } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          {/* Logo mimicking the provided visual concept */}
          <Link to="/" className="flex items-center relative text-blue-500">
            <Share2 size={28} strokeWidth={2.5} />
            <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full translate-x-1.5 -translate-y-1.5" />
          </Link>
          <Link to="/" className="font-display font-bold text-2xl tracking-tight text-slate-800">
            nexus <span className="text-blue-500">media</span>
          </Link>
        </motion.div>
        <div className="hidden md:flex space-x-8 items-center text-sm font-medium text-slate-600">
          <Link to="/opportunity" className="hover:text-blue-600 transition-colors">The Opportunity</Link>
          <Link to="/packages" className="hover:text-blue-600 transition-colors">Our Packages</Link>
          <Link to="/why-nexus" className="hover:text-blue-600 transition-colors">Why Nexus?</Link>
          <Link 
            to="/get-started" 
            className="px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors shadow-sm"
          >
            Get a Website
          </Link>
        </div>
      </div>
    </nav>
  );
}
