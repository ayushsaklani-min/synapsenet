import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Clock, Zap, ExternalLink } from 'lucide-react';
import { SynapseEvent } from '../types';

interface EventFeedProps {
  events: SynapseEvent[];
}

const EventFeed: React.FC<EventFeedProps> = ({ events }) => {
  const [highlight, setHighlight] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[0];
      setHighlight(prev => new Set([...prev, latestEvent.id]));

      const timeout = setTimeout(() => {
        setHighlight(prev => {
          const next = new Set(prev);
          next.delete(latestEvent.id);
          return next;
        });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [events]);

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events]);

  const theme = {
    price_update: {
      badge: 'text-emerald-300',
      accent: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-500',
    },
    score_update: {
      badge: 'text-purple-300',
      accent: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
    },
  } as const;

  const format = (event: SynapseEvent) => {
    if (event.type === 'price_update') {
      const price = event.data.price ?? 0;
      const token = event.data.token ?? 'ETH';
      const source = event.data.source ?? 'Chainlink Oracle';
      const network = event.data.network ? ` (${event.data.network})` : '';
      return `${token}/USD: $${typeof price === 'number' ? price.toFixed(2) : price} (${source}${network})`;
    }

    if (event.type === 'score_update') {
      return `User: ${event.data.user_id ?? 'unknown'} | Score: ${typeof event.data.score === 'number' ? event.data.score.toFixed(1) : event.data.score}`;
    }

    return JSON.stringify(event.data);
  };

  const getEventIcon = (event: SynapseEvent) => {
    const IconComponent = theme[event.type as keyof typeof theme]?.icon || Activity;
    return IconComponent;
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
          <Activity className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No Events Yet</h3>
        <p className="text-sm text-gray-400">Waiting for real-time blockchain data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Event Stream Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-white">Live Events</span>
          <span className="text-xs text-gray-400">({events.length})</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          <span>Auto-refresh</span>
        </div>
      </div>

      {/* Events List */}
      <div 
        ref={scrollRef}
        className="max-h-96 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
        style={{ scrollbarWidth: 'thin' }}
      >
        <AnimatePresence initial={false}>
          {events.slice(0, 50).map((event, index) => {
            const palette = theme[event.type as keyof typeof theme] ?? theme.price_update;
            const isNew = highlight.has(event.id);
            const IconComponent = getEventIcon(event);
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.02,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className={`relative overflow-hidden rounded-xl border ${palette.border} ${palette.accent} p-4 transition-all duration-300 ${
                  isNew ? 'shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-500/50' : ''
                }`}
              >
                {/* Event Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${palette.color} shadow-sm`}>
                      <IconComponent className="h-3 w-3 text-white" />
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${palette.badge}`}>
                      {event.type.replace('_', ' ')}
                    </span>
                    {isNew && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                      />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 font-mono">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">
                      {event.sourceChain}
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="text-sm text-gray-200 font-mono">
                  {format(event)}
                </div>

                {/* Animated border for new events */}
                {isNew && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>Real-time</span>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span>{events.length} total events</span>
          </div>
        </div>
        <div className="text-gray-500">
          Powered by Chainlink Oracle
        </div>
      </div>
    </div>
  );
};

export default EventFeed;