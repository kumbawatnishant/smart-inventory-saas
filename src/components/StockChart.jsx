import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const StockChart = ({ data }) => {
  // Expects data prop to be an array of objects: { date: '2023-01-01', stock_level: 45 }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Trends (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#9ca3af' }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#9ca3af' }} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="stock_level"
            name="Stock Level"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;