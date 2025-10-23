import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { SynapseEvent } from '../types';

interface LiveChartProps {
  data: SynapseEvent[];
  currentPrice: number;
  priceChange: number;
  containerClassName?: string;
}

const LiveChart: React.FC<LiveChartProps> = ({
  data,
  currentPrice,
  priceChange,
  containerClassName = '',
}) => {
  const chartData = useMemo(() => {
    return data
      .slice(0, 30)
      .reverse()
      .map((event, index) => ({
        time: new Date(event.timestamp).toLocaleTimeString(),
        price: Number(event?.data?.price ?? 0),
        index,
        timestamp: event.timestamp,
      }));
  }, [data]);

  const priceChangePercent = currentPrice > 0 && priceChange !== 0 
    ? (priceChange / (currentPrice - priceChange)) * 100 
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-md border border-blue-500/30 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold text-sm">
            ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-gray-300 text-xs">{label}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-4 ${containerClassName}`}>
      {/* Price Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <span className="text-white font-semibold text-lg">ETH/USD</span>
          </div>
          {currentPrice > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-white">
                ${currentPrice.toFixed(2)}
              </span>
              {priceChange !== 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${
                    priceChange > 0 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {priceChange > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(priceChangePercent).toFixed(2)}%
                  </span>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Activity className="h-4 w-4" />
          <span>{data.length} updates</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={80}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="flex items-center justify-between text-sm text-gray-400 pt-2 border-t border-white/10">
        <div className="flex items-center space-x-4">
          <span>Source: Chainlink Oracle</span>
          <span>Network: Polygon Amoy</span>
        </div>
        <div className="text-xs">
          Last update: {data.length > 0 ? new Date(data[0].timestamp).toLocaleTimeString() : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default LiveChart;