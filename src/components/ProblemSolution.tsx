import { motion } from "motion/react";
import { Search, ShieldCheck, TrendingDown } from "lucide-react";

const opportunities = [
  {
    icon: <Search className="text-blue-500" size={28} />,
    title: "81% Research Online First",
    description: "Industry studies show that the vast majority of consumers research businesses online before buying or visiting. If you're not visible, you're missing out."
  },
  {
    icon: <ShieldCheck className="text-blue-500" size={28} />,
    title: "Facebook Isn't Enough",
    description: "While having a page is great, a dedicated website builds superior credibility, trust, and professional control over your brand image."
  },
  {
    icon: <TrendingDown className="text-blue-500" size={28} />,
    title: "Shattering the Price Barrier",
    description: "Most believe a website costs upwards of ₱20,000 to ₱100,000. We leverage modern technology to deliver premium results at a fraction of the cost."
  }
];

export function ProblemSolution() {
  return (
    <section id="problem" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-slate-900 mb-4">
            Why Local Businesses Need More Than Social Media
          </h2>
          <p className="text-lg text-slate-600">
            A social media page is a good start, but a professional website is the foundation of digital credibility and lasting business growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {opportunities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
