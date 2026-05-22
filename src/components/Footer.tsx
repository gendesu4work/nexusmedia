import { Share2 } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center space-x-2 text-white mb-6">
            <Share2 size={24} className="text-blue-500" strokeWidth={2.5} />
            <Link to="/" className="font-display font-bold text-xl tracking-tight text-white">
              nexus <span className="text-blue-500">media</span>
            </Link>
          </div>
          <p className="max-w-xs leading-relaxed text-sm">
            Empowering local businesses in the Philippines with professional, highly affordable websites to build credibility and drive growth.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4 tracking-wide">Services</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/packages" className="hover:text-blue-400 transition-colors">Landing Pages</Link></li>
            <li><Link to="/packages" className="hover:text-blue-400 transition-colors">Business Websites</Link></li>
            <li><Link to="/packages" className="hover:text-blue-400 transition-colors">SEO & Maintenance</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 tracking-wide">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li>Let's build your online presence.</li>
            <li><Link to="/get-started" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold">Start a Project &rarr;</Link></li>
            <li><span className="text-blue-400 mt-2 block break-all">nexusmediaphilippines@gmail.com</span></li>
            <li><span className="text-blue-400 block break-all">+63 993 925 8293</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Nexus Media. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
