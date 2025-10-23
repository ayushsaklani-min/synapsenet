import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ChainNetwork: React.FC = () => {
  const [stats, setStats] = useState({ pf: 0, is: 0, latency: 60 });
  const [isHealthy, setIsHealthy] = useState(true);
  
  useEffect(() => { 
    const i = setInterval(() => {
      const newLatency = 40 + Math.round(Math.random() * 60);
      setStats(s => ({ 
        pf: s.pf + Math.floor(Math.random() * 3) + 1, 
        is: s.is + Math.floor(Math.random() * 2) + 1, 
        latency: newLatency
      }));
      setIsHealthy(newLatency < 80);
    }, 2000); 
    return () => clearInterval(i); 
  }, []);

  const chains = [
    {
      name: 'Price Feed',
      events: stats.pf,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-400/30',
      icon: '💰'
    },
    {
      name: 'Identity Score',
      events: stats.is,
      color: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-400/30',
      icon: '👤'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Chain Network
        </h3>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-3 h-3 rounded-full ${
            isHealthy 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50' 
              : 'bg-gradient-to-r from-red-400 to-red-500 shadow-lg shadow-red-500/50'
          }`}
        />
      </div>

      <div className="space-y-4">
        {chains.map((chain, index) => (
          <motion.div
            key={chain.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${chain.bgColor} backdrop-blur-lg rounded-xl p-4 border ${chain.borderColor} hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{chain.icon}</span>
                <div>
                  <div className="text-white font-medium">{chain.name}</div>
                  <div className="text-sm text-slate-400">Microchain</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold bg-gradient-to-r ${chain.color} bg-clip-text text-transparent`}>
                  {chain.events}
                </div>
                <div className="text-xs text-slate-400">events</div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Network Health */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-lg rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-medium">Network Health</span>
            <span className={`text-sm font-semibold ${
              isHealthy ? 'text-green-400' : 'text-red-400'
            }`}>
              {isHealthy ? 'Healthy' : 'Degraded'}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Latency</span>
              <span className="text-white">{stats.latency}ms</span>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  stats.latency < 50 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                  stats.latency < 80 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  'bg-gradient-to-r from-red-400 to-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (100 - stats.latency) * 1.5)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-slate-500">
              <span>0ms</span>
              <span>100ms</span>
            </div>
          </div>
        </motion.div>

        {/* Network Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center pt-2"
        >
          <div className="inline-flex items-center space-x-2 text-slate-400 text-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
            />
            <span>Syncing with Linera Network</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChainNetwork;