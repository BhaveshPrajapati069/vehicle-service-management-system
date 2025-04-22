import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import API from '../api';

function RevenueChart() {
  const [revenue, setRevenue] = useState({ daily: 0, monthly: 0, yearly: 0 });
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchRevenue();
    const interval = setInterval(fetchRevenue, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRevenue = async () => {
    try {
      const res = await API.get('revenue/');
      setRevenue(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching revenue:', error);
    }
  };

  const data = [
    { name: 'Daily', amount: revenue.daily },
    { name: 'Monthly', amount: revenue.monthly },
    { name: 'Yearly', amount: revenue.yearly },
  ];

  return (
    <div className="container mt-4">
      <h4 className="mb-3">📊 Revenue Summary</h4>
      {lastUpdated && (
        <p className="text-muted">Last updated: {lastUpdated}</p>
      )}
      <div className="card shadow-sm p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#28a745" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;
