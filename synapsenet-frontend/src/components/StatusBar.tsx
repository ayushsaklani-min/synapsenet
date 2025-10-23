import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Clock, Zap } from 'lucide-react';

interface StatusBarProps {
  isConnected: boolean;
  avgLatency: number;
  lastUpdated: Date;
}

const StatusBar: React.FC<StatusBarProps> = ({
  isConnected,
  avgLatency,
  lastUpdated,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="glass-panel rounded-2xl p-4"
    >
      <div className="flex items-center justify-between">
        {/* Connection Status */}
        <div className="flex items-center space-x-6">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            isConnected
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {isConnected ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Latency */}
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Zap className="h-4 w-4 text-blue-400" />
            <span>Latency: {avgLatency}ms</span>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusBar;