import { motion } from "motion/react";
import { Cpu, Zap, BadgeDollarSign } from "lucide-react";

export function WhyUs() {
  return (
    <section id="why-us" className="py-24 bg-blue-600 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffffff" d="M45.7,-76.4C58.9,-69.3,69.5,-55.5,78.2,-41.1C86.9,-26.7,93.7,-11.7,92.5,2.7C91.3,17.1,82.1,30.8,71.8,42.5C61.5,54.2,50.1,63.9,37.1,72.1C24.1,80.3,9.5,87,-6.1,89.5C-21.7,92,-38.2,90.3,-51.7,82.3C-65.2,74.3,-75.7,60.1,-82.4,44.5C-89.1,28.9,-92,-10,-86.1,-26.3C-80.2,-42.6,-65.5,-56.3,-50.2,-62.4C-34.9,-68.5,-19,-67,-2.4,-63.5C14.2,-60,28.4,-54.5,45.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight mb-6 leading-tight">
              Why Nexus Media?
            </h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              You can choose an expensive, traditional agency for your website—but you'll simply be paying a premium for their brand name. We provide the exact same professional results at a fraction of the cost.
            </p>
            <p className="text-xl font-semibold mb-8">
              How are we so affordable?
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-500 bg-opacity-50 p-3 rounded-xl mr-4 shrink-0">
                  <Cpu className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Modern Technology</h4>
                  <p className="text-blue-100 text-sm leading-relaxed">We leverage advanced development tools and AI to build websites faster and more efficiently than traditional methods.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 bg-opacity-50 p-3 rounded-xl mr-4 shrink-0">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Unmatched Speed</h4>
                  <p className="text-blue-100 text-sm leading-relaxed">By optimizing our workflow, what takes traditional agencies weeks, takes us a fraction of the time. We pass those time savings directly to you.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 bg-opacity-50 p-3 rounded-xl mr-4 shrink-0">
                  <BadgeDollarSign className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">10x More Affordable</h4>
                  <p className="text-blue-100 text-sm leading-relaxed">Same premium design, same functionality, significantly less overhead. We make professional websites accessible to local businesses.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Abstract geometric visual for Why Us */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-blue-400 rounded-3xl opacity-50 blur-2xl" />
              <div className="relative h-full w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center space-y-8">
                <div className="flex space-x-4">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-16 h-16 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-sm" />
                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} className="w-16 h-16 bg-blue-300/30 rounded-full border border-white/30 backdrop-blur-sm" />
                </div>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border-4 border-white/20 border-t-white/80 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
