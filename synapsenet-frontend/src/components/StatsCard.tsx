import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  suffix = '',
  icon: Icon,
  gradient,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-panel rounded-2xl p-6 transition-all duration-300 hover:shadow-glow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-right">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="text-2xl font-bold text-white"
          >
            {value.toLocaleString()}
            {suffix}
          </motion.div>
        </div>
      </div>
      
      <div className="text-sm font-medium text-gray-300 uppercase tracking-wider">
        {title}
      </div>
      
      {/* Animated progress bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1, delay: delay + 0.5 }}
        className={`h-1 mt-3 rounded-full bg-gradient-to-r ${gradient}`}
      />
    </motion.div>
  );
};

export default StatsCard;