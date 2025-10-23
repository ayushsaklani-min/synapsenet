import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';

interface Event {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  sourceChain: string;
}

interface DashboardProps { 
  events: Event[]; 
}

// Animated Counter Component
const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const startValue = displayValue;
    const endValue = value;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      setDisplayValue(Math.floor(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{displayValue}</span>;
};

const Dashboard: React.FC<DashboardProps> = ({ events }) => {
  const priceEvents = events.filter(e => e.type === 'price_update');
  const scoreEvents = events.filter(e => e.type === 'score_update');
  const priceData = priceEvents.slice(0, 20).reverse().map((e) => ({ 
    time: new Date(e.timestamp).toLocaleTimeString(), 
    price: e.data.price 
  }));
  const scoreData = scoreEvents.slice(0, 10).reverse().map((e) => ({ 
    user: e.data.user_id, 
    score: e.data.score 
  }));
  
  const stats = { 
    totalEvents: events.length, 
    priceUpdates: priceEvents.length, 
    scoreUpdates: scoreEvents.length, 
    avgLatency: Math.floor(Math.random() * 30 + 40) // Simulate varying latency
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
    >
      <motion.h2 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-8"
      >
        Live Data Dashboard
      </motion.h2>
      
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-400/30 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
            <div className="text-blue-300 text-sm font-medium">Total Events</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            <AnimatedCounter value={stats.totalEvents} />
          </div>
          <div className="text-blue-200/70 text-sm">Real-time updates</div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-400/30 shadow-lg hover:shadow-green-500/25 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
            <div className="text-green-300 text-sm font-medium">Price Updates</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            <AnimatedCounter value={stats.priceUpdates} />
          </div>
          <div className="text-green-200/70 text-sm">Market data</div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-400/30 shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full animate-pulse"></div>
            <div className="text-purple-300 text-sm font-medium">Score Updates</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            <AnimatedCounter value={stats.scoreUpdates} />
          </div>
          <div className="text-purple-200/70 text-sm">Identity data</div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-400/30 shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-pulse"></div>
            <div className="text-orange-300 text-sm font-medium">Avg Latency</div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            <AnimatedCounter value={stats.avgLatency} duration={1} />ms
          </div>
          <div className="text-orange-200/70 text-sm">Network speed</div>
        </motion.div>
      </div>

      {/* Enhanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Price Feed (ETH)</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(59, 130, 246, 0.3)', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill="url(#priceGradient)"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Identity Scores</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-400 text-sm font-medium">Live</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="user" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                  border: '1px solid rgba(139, 92, 246, 0.3)', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Bar 
                dataKey="score" 
                fill="url(#scoreGradient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;