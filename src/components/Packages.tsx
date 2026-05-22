import { motion } from "motion/react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const packages = [
  {
    name: "Starter Online Presence",
    price: "₱2,500",
    description: "A simple credibility landing page. Best for businesses that want to test having an online presence.",
    features: [
      "1-page landing website",
      "Custom design direction",
      "Brand color palette setup",
      "Business information section",
      "Basic portfolio / sample work",
      "Mobile-friendly layout",
      "Hosted online (temporary link)"
    ],
    notIncluded: [
      "Custom domain",
      "Interactive features (booking, forms)",
      "SEO optimization"
    ],
    popular: false
  },
  {
    name: "Business Website",
    price: "₱7,000",
    description: "A fully functional multi-section website. Designed to turn visitors into real customers through clear structure.",
    features: [
      "Multi-page website (Home, About, Services, Contact)",
      "Interactive CTA buttons (Call/Messenger)",
      "Contact form integration",
      "Google Maps integration",
      "Basic SEO setup",
      "Mobile & speed optimized design",
      "Portfolio or gallery section",
      "Social media integration"
    ],
    notIncluded: [],
    popular: true
  },
  {
    name: "Professional Growth Website",
    price: "₱15,000",
    description: "A complete credibility and visibility system. Built to make your business easier to find and more trusted.",
    features: [
      "Everything in Business Website",
      "Custom domain (1 year included)",
      "Advanced SEO optimization",
      "Google Business Profile optimization",
      "Faster performance optimization",
      "Enhanced premium UI/UX design",
      "Priority support & revisions",
      "Basic analytics tracking setup"
    ],
    notIncluded: [],
    popular: false
  }
];

const maintenancePlan = {
  name: "Business Growth & Maintenance",
  price: "₱1,500 – ₱3,000 /mo",
  description: "Keep your website secure, fast, and constantly improving in Google search rankings.",
  categories: [
    {
      name: "Maintenance & Updates",
      items: ["Fix bugs or errors", "Update content (prices, services)", "Security monitoring", "Performance optimization"]
    },
    {
      name: "SEO & Visibility Boost",
      items: ["Monthly keyword optimization", "Local SEO updates", "Google Business Profile updates", "Competitor tracking"]
    }
  ]
};

export function Packages() {
  return (
    <section id="packages" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900 mb-4">
            Transparent Pricing, Real Results
          </h2>
          <p className="text-lg text-slate-600">
            Choose the package that fits your business goals. No hidden fees, no complicated agency contracts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl border ${pkg.popular ? 'border-blue-500 shadow-xl shadow-blue-50' : 'border-slate-200 shadow-sm'} p-8 flex flex-col`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-extrabold text-slate-900">{pkg.price}</span>
                  {pkg.price.includes('/mo') && <span className="text-slate-500 ml-1">/mo</span>}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed h-16">{pkg.description}</p>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Includes</p>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start">
                        <Check className="text-blue-500 shrink-0 mr-3 h-5 w-5" />
                        <span className="text-slate-600 text-sm leading-tight pt-0.5">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {pkg.notIncluded.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Not Included</p>
                    <ul className="space-y-3 opacity-60">
                      {pkg.notIncluded.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start">
                          <div className="shrink-0 mr-3 h-5 w-5 flex items-center justify-center">
                            <div className="h-0.5 w-3 bg-slate-400" />
                          </div>
                          <span className="text-slate-500 text-sm leading-tight pt-0.5">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Link 
                to={`/get-started?package=${encodeURIComponent(pkg.name)}`}
                className={`flex items-center justify-center w-full mt-8 py-3 rounded-xl font-semibold transition-colors ${pkg.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Maintenance Plan Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900 rounded-3xl p-8 lg:p-12 text-white border border-slate-800"
        >
          <div className="lg:flex justify-between items-center mb-10">
            <div className="mb-6 lg:mb-0 max-w-xl">
              <h3 className="text-2xl font-bold mb-2">{maintenancePlan.name}</h3>
              <p className="text-slate-400">{maintenancePlan.description}</p>
            </div>
            <div className="text-left lg:text-right">
              <div className="text-3xl font-bold text-blue-400">{maintenancePlan.price}</div>
              <div className="text-sm text-slate-400">Cancel anytime</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {maintenancePlan.categories.map((cat, idx) => (
              <div key={idx}>
                <h4 className="text-lg font-semibold mb-4 text-blue-300">{cat.name}</h4>
                <ul className="space-y-3">
                  {cat.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start text-slate-300 text-sm">
                      <Check className="text-blue-500 shrink-0 mr-3 h-5 w-5" />
                      <span className="pt-0.5">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
