import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface Event {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  sourceChain: string;
}

interface PriceChartProps {
  data: Event[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  
  const chartData = useMemo(() => {
    return data
      .slice(0, 50)
      .reverse()
      .map((event, index) => ({
        time: new Date(event.timestamp).toLocaleTimeString(),
        price: Number(event?.data?.price ?? 0),
        index,
        timestamp: event.timestamp,
      }));
  }, [data]);

  const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1]?.price : 0;
  const previousPrice = chartData.length > 1 ? chartData[chartData.length - 2]?.price : 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{`Price: $${payload[0].value.toFixed(2)}`}</p>
          <p className="text-gray-400 text-sm">{`Time: ${label}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#375BD2] to-[#00D4FF]"></div>
            <span className="text-white font-semibold">ETH/USD</span>
          </div>
          {currentPrice > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                ${currentPrice.toFixed(2)}
              </span>
              {priceChange !== 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
                    priceChange > 0 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {priceChange > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(priceChangePercent).toFixed(2)}%
                  </span>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Chart Type Toggle */}
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              chartType === 'area'
                ? 'bg-[#375BD2] text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              chartType === 'line'
                ? 'bg-[#375BD2] text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Line
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#375BD2" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={80}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#375BD2"
                strokeWidth={2}
                dot={false}
                fillOpacity={1}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={80}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#375BD2"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#375BD2' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Stats */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>{data.length} updates</span>
          </div>
          <div>
            <span>Source: Chainlink Oracle</span>
          </div>
        </div>
        <div className="text-xs">
          Last update: {data.length > 0 ? new Date(data[0].timestamp).toLocaleTimeString() : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
