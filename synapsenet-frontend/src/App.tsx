import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  GaugeCircle,
  Radio,
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
  Zap,
  type LucideIcon,
} from 'lucide-react';
// Component imports
import StatsCard from './components/StatsCard';
import LiveChart from './components/LiveChart';
import EventFeed from './components/EventFeed';
import StatusBar from './components/StatusBar';
import { SynapseEvent } from './types';
import './styles/global.css';

const NAV_VARIANTS = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0 },
};

type StatsKey = 'totalEvents' | 'priceUpdates' | 'scoreUpdates' | 'avgLatency';

const statsMeta: Array<{
  key: StatsKey;
  label: string;
  icon: LucideIcon;
  suffix?: string;
  color: string;
}> = [
  { key: 'totalEvents', label: 'Total Events', icon: Activity, color: 'from-blue-500 to-cyan-500' },
  { key: 'priceUpdates', label: 'Price Updates', icon: BarChart3, color: 'from-emerald-500 to-green-500' },
  { key: 'scoreUpdates', label: 'Score Updates', icon: Radio, color: 'from-purple-500 to-pink-500' },
  { key: 'avgLatency', label: 'Avg Latency', icon: GaugeCircle, suffix: ' ms', color: 'from-orange-500 to-red-500' },
];

function App() {
  const [events, setEvents] = useState<SynapseEvent[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [avgLatency, setAvgLatency] = useState<number>(52);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [eventFilter, setEventFilter] = useState<'all' | 'price' | 'score'>('all');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Simulate real blockchain data stream
    // Initialize with some starting data
    const initialEvents: SynapseEvent[] = [];
    for (let i = 0; i < 5; i++) {
      const timestamp = Date.now() - (i * 2000);
      const price = 3200 + (Math.random() - 0.5) * 100;
      
      initialEvents.push({
        id: crypto.randomUUID(),
        type: 'price_update',
        data: {
          token: 'ETH',
          price: Number(price.toFixed(2)),
          source: 'Chainlink Oracle',
          network: 'Polygon Amoy',
        },
        timestamp,
        sourceChain: 'price-feed',
      });
    }
    
    setEvents(initialEvents);
    if (initialEvents.length > 0) {
      setCurrentPrice(initialEvents[0].data.price as number);
    }
    
    const interval = setInterval(() => {
      const eventType = Math.random() > 0.5 ? 'price_update' : 'score_update';
      const now = Date.now();
      
      let event: SynapseEvent;
      
      if (eventType === 'price_update') {
        // Simulate realistic ETH price movements
        const basePrice = 3200 + Math.sin(now / 10000) * 200; // Oscillating around $3200
        const volatility = (Math.random() - 0.5) * 50; // ±$25 volatility
        const price = Math.max(2800, basePrice + volatility);
        
        event = {
          id: crypto.randomUUID(),
          type: 'price_update',
          data: {
            token: 'ETH',
            price: Number(price.toFixed(2)),
            source: 'Chainlink Oracle',
            network: 'Polygon Amoy',
          },
          timestamp: now,
          sourceChain: 'price-feed',
        };
        
        // Update current price and calculate change
        setCurrentPrice(prev => {
          if (prev > 0) {
            setPriceChange(price - prev);
          } else {
            setPriceChange(0);
          }
          return price;
        });
      } else {
        // Simulate identity score updates
        const userId = `user_${Math.floor(Math.random() * 1000)}`;
        const score = Math.max(0, Math.min(100, 50 + (Math.random() - 0.5) * 30));
        
        event = {
          id: crypto.randomUUID(),
          type: 'score_update',
          data: {
            user_id: userId,
            score: Number(score.toFixed(1)),
          },
          timestamp: now,
          sourceChain: 'identity-score',
        };
      }
      
      setEvents(prev => [event, ...prev.slice(0, 199)]);
      setLastUpdated(new Date());
      setAvgLatency(35 + Math.floor(Math.random() * 20)); // 35-55ms latency
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const priceEvents = useMemo(() => events.filter(e => e.type === 'price_update'), [events]);
  const scoreEvents = useMemo(() => events.filter(e => e.type === 'score_update'), [events]);
  const filteredEvents = useMemo(() => {
    switch (eventFilter) {
      case 'price': return events.filter(e => e.type === 'price_update');
      case 'score': return events.filter(e => e.type === 'score_update');
      default: return events;
    }
  }, [events, eventFilter]);

  const stats = {
    totalEvents: events.length,
    priceUpdates: priceEvents.length,
    scoreUpdates: scoreEvents.length,
    avgLatency,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans"
    >
      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={NAV_VARIANTS}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 backdrop-blur-xl border-b bg-slate-800/80 border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
             <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-glow">
               <Zap className="h-5 w-5 text-white" />
             </div>
             <div>
               <h1 className="text-2xl font-semibold tracking-tight text-white text-glow">
                 SynapseNet
               </h1>
               <p className="text-xs text-gray-300">Real-time Data Mesh</p>
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4 md:space-x-6"
          >
            {/* Connection Status */}
             <div className={`flex items-center space-x-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                 isConnected
                   ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-glow'
                   : 'bg-red-500/20 border border-red-400/30 text-red-300'
               }`}>
               {isConnected ? (
                 <Wifi className="h-4 w-4 text-emerald-400" />
               ) : (
                 <WifiOff className="h-4 w-4 text-red-400" />
               )}
               <span>
                 {isConnected ? 'Connected' : 'Disconnected'}
               </span>
             </div>

            {/* Current Price Display */}
            {currentPrice > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                 className="hidden sm:flex items-center space-x-3 rounded-xl glass-panel px-3 py-2 text-white shadow-glow transition-all duration-300 hover:shadow-neon"
              >
                <span className="text-sm font-medium">ETH/USD</span>
                <span className="text-lg font-semibold">
                  ${currentPrice.toFixed(2)}
                </span>
                {priceChange !== 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                     className={`flex items-center space-x-1 text-sm ${
                       priceChange > 0 ? 'text-emerald-400' : 'text-red-400'
                     }`}
                  >
                    {priceChange > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium">
                      {Math.abs(priceChange).toFixed(2)}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Live Indicator */}
             <div className="hidden md:flex items-center space-x-2 text-xs font-medium text-gray-300">
               <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulseSlow" />
               <span>Live Data</span>
             </div>
          </motion.div>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-10">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsMeta.map((card, index) => (
            <StatsCard
              key={card.key}
              title={card.label}
              value={stats[card.key]}
              suffix={card.suffix}
              icon={card.icon}
              gradient={card.color}
              delay={index * 0.05}
            />
          ))}
        </section>

        {/* Main Grid: Chart + Events */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
             className="lg:col-span-2 rounded-2xl glass-panel p-6 shadow-glow w-full h-[420px] flex flex-col transition-all duration-300 hover:shadow-neon"
          >
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gray-400">Live Feed</p>
                <h2 className="text-2xl font-semibold text-blue-400">
                  Live ETH/USD — Chainlink Oracle Feed (Polygon Amoy)
                </h2>
                <p className="text-sm text-gray-300">Real-time price data streamed via Chainlink Oracle</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400 shadow-glow">
                  <span className="h-2 w-2 animate-pulseSlow rounded-full bg-emerald-400" />
                  <span>Live</span>
                </span>
                <span className="text-sm text-gray-300">Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            </header>
            <div className="flex-1 pt-4">
              <LiveChart
                data={priceEvents}
                currentPrice={currentPrice}
                priceChange={priceChange}
                containerClassName="h-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
             className="rounded-2xl glass-panel p-6 shadow-glow transition-all duration-300 hover:shadow-neon"
          >
            <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gray-400">Chain events</p>
                <h3 className="text-2xl font-semibold text-blue-400">Live Blockchain Events</h3>
                <p className="text-sm text-gray-300">Monitor price and identity updates in real time</p>
      </div>
              <div className="flex space-x-2">
                {(['all', 'price', 'score'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setEventFilter(filter)}
                     className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
                       eventFilter === filter
                         ? 'bg-blue-500 text-white shadow-glow'
                         : 'glass-panel text-gray-300 hover:bg-blue-500/20 hover:text-blue-400'
                     }`}
                  >
                    {filter === 'all' ? 'All' : filter === 'price' ? 'Price' : 'Score'}
        </button>
                ))}
      </div>
            </header>

            <EventFeed events={filteredEvents} />
          </motion.div>
        </section>

        <StatusBar
          isConnected={isConnected}
          avgLatency={avgLatency}
          lastUpdated={lastUpdated}
        />

         <footer className="mt-10 text-center text-sm text-gray-400">
           Powered by <span className="text-blue-400 font-semibold">Linera</span> & <span className="text-blue-400 font-semibold">Chainlink</span> · Polygon Amoy Oracle Feed
         </footer>
      </main>
    </motion.div>
  );
}

export default App;