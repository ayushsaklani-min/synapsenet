import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  Cell,
} from 'recharts';

interface Event {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  sourceChain: string;
}

interface ScoresChartProps {
  data: Event[];
}

const palette = ['#8b5cf6', '#6366f1', '#22d3ee', '#38bdf8'];

const ScoresChart: React.FC<ScoresChartProps> = ({ data }) => {
  const users = new Map<string, { score: number; timestamp: number }>();

  data.forEach(event => {
    const user = event?.data?.user_id as string | undefined;
    if (!user) return;
    const score = Number(event?.data?.score ?? 0);
    const current = users.get(user);
    if (!current || event.timestamp > current.timestamp) {
      users.set(user, { score, timestamp: event.timestamp });
    }
  });

  const chartData = Array.from(users.entries())
    .map(([user, payload]) => ({ user, score: Number(payload.score.toFixed(1)), timestamp: payload.timestamp }))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 12)
    .reverse();

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.1 }}
      viewport={{ once: true, amount: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl bg-white/10 p-6 shadow-xl backdrop-blur-lg"
    >
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-white">Identity Scores</h2>
          <p className="text-sm text-gray-400">Latest trust metrics</p>
        </div>
        <span className="rounded-xl bg-white/10 px-3 py-1 text-sm text-accent">Scores</span>
      </header>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
            <XAxis
              dataKey="user"
              tick={{ fill: '#cbd5f5', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-15}
              dx={-8}
            />
            <YAxis
              tick={{ fill: '#cbd5f5', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 26, 0.92)',
                borderRadius: 12,
                border: 'none',
                color: '#e2e8f0',
              }}
              labelStyle={{ color: '#cbd5f5' }}
            />
            <Bar dataKey="score" radius={[12, 12, 12, 12]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={palette[index % palette.length]} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.article>
  );
};

export default ScoresChart;
