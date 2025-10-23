import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CountProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

const Count: React.FC<CountProps> = ({ value, suffix = '', duration = 1, className = '' }) => {
  const [display, setDisplay] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value === display) return;
    
    setIsAnimating(true);
    let start: number | null = null;
    const initial = display;
    const diff = value - initial;

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Smoother easing
      const currentValue = Math.round(initial + diff * eased);
      setDisplay(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, display]);

  return (
    <motion.div
      animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      <p className={`text-2xl font-bold text-white drop-shadow-[0_0_20px_rgba(55,91,210,0.4)] md:text-3xl ${className}`}>
        {display.toLocaleString()}
        {suffix}
      </p>
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
        />
      )}
    </motion.div>
  );
};

const StatsGrid = { Count };

export default StatsGrid;

