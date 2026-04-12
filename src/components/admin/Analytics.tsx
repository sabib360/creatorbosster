import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Credits Used',
        data: [1200, 1900, 1500, 2100, 2400, 1800, 2200],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: ['Free', 'Premium', 'Pro', 'Agency'],
    datasets: [
      {
        label: 'Active Users',
        data: [850, 240, 120, 45],
        backgroundColor: [
          'rgba(148, 163, 184, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(168, 85, 247, 0.5)',
        ],
        borderColor: [
          '#94a3b8',
          '#22c55e',
          '#3b82f6',
          '#a855f7',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        borderColor: '#1e293b',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(30, 41, 59, 0.5)',
        },
        ticks: {
          color: '#64748b',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">Analytics</h2>
        <p className="text-slate-400">Deep dive into platform usage and growth metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Credit Consumption (Weekly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line data={lineData} options={options} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">User Distribution by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar data={barData} options={options} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
