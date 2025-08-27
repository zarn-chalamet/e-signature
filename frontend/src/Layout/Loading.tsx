import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // Using shadcn's Lucide icons

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-6"
      >
        {/* Animated logo or brand mark */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary p-1">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">

            </div>
          </div>
          
          {/* Floating particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                x: Math.random() * 40 - 20,
                y: Math.random() * 40 - 20,
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute top-0 left-0 w-2 h-2 rounded-full bg-primary"
              style={{
                left: "50%",
                top: "50%",
              }}
            />
          ))}
        </motion.div>

        {/* Loading text and spinner */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">Loading Up</h2>
            <p className="text-sm mt-1 text-gray-700">
              Preparing everything for you
            </p>
          </motion.div>
        </div>

        {/* Progress bar */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "80%" }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="h-1.5 w-full max-w-xs rounded-full bg-secondary/20 overflow-hidden"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};


export default Loading