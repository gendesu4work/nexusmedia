import { motion } from "motion/react";
import { Share2, ArrowUpRight, Hexagon, CircleDashed } from "lucide-react";

export function AbstractHeroGraphic() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] border-[1px] border-blue-100 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-[400px] h-[400px] border-[1px] border-blue-200 rounded-full flex items-center justify-center p-4 border-dashed"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bg-white p-6 rounded-2xl shadow-xl border border-blue-50 z-10"
      >
        <div className="flex items-center space-x-2 text-blue-600">
          <Share2 size={48} strokeWidth={1.5} />
          <ArrowUpRight size={48} strokeWidth={1.5} className="-ml-6 mt-6" />
        </div>
      </motion.div>
      <div className="absolute top-1/4 left-1/4 text-slate-200">
        <Hexagon size={64} strokeWidth={1} />
      </div>
      <div className="absolute bottom-1/4 right-1/4 text-blue-100">
        <CircleDashed size={80} strokeWidth={1} />
      </div>
    </div>
  );
}
