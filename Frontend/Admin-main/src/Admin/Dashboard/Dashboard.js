import React from 'react';
import AdminLayout from "../../layouts/AdminLayout";
import {
  Download,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Layers,
  Users,
  Activity,
  ChevronRight
} from "lucide-react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- Components ---

const Sparkline = ({ color, data }) => {
  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        data: data,
        borderColor: color,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 100);
          gradient.addColorStop(0, `${color}20`); // Very transparent
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          return gradient;
        },
        fill: true,
        borderWidth: 2,
        tension: 0.5,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false, min: Math.min(...data) * 0.8, max: Math.max(...data) * 1.1 },
    },
    elements: { line: { capBezierPoints: true } }
  };

  return (
    <div style={{ height: '40px', width: '100px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

const StatCard = ({ title, value, subtext, trend, trendType, icon: Icon, color, chartData }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
      {chartData && <Sparkline color={color.includes('emerald') ? '#10B981' : color.includes('rose') ? '#F43F5E' : '#6366f1'} data={chartData} />}
    </div>

    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{value}</h3>
      <p className="text-sm text-gray-500 font-medium mb-3">{title}</p>

      <div className="flex items-center gap-2">
        <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trendType === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
          {trend}
        </div>
        <span className="text-xs text-gray-400">vs last month</span>
      </div>
    </div>
  </div>
);

const DonationTable = () => {
  const transactions = [
    { name: "John Doe", email: "john@example.com", amount: "$500.00", date: "Oct 24, 2024", method: "Credit Card", campaign: "Ramadan Drive", status: "Approved" },
    { name: "Sarah Smith", email: "sarah@example.com", amount: "$120.00", date: "Oct 23, 2024", method: "PayPal", campaign: "Education Fund", status: "Approved" },
    { name: "Amir Khan", email: "amir@example.com", amount: "$1,000.00", date: "Oct 22, 2024", method: "Wire", campaign: "Medical Aid", status: "Pending" },
    { name: "Emily Davis", email: "emily@example.com", amount: "$50.00", date: "Oct 21, 2024", method: "Card", campaign: "General", status: "Approved" },
    { name: "Michael Brown", email: "mike@example.com", amount: "$250.00", date: "Oct 20, 2024", method: "PayPal", campaign: "Winter Relief", status: "Rejected" },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved": return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "Pending": return "bg-amber-50 text-amber-700 border border-amber-100";
      case "Rejected": return "bg-rose-50 text-rose-700 border border-rose-100";
      default: return "bg-gray-50 text-gray-700 border border-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm mt-8 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recent Donations</h3>
          <p className="text-sm text-gray-500 mt-0.5">Latest financial contributions to the foundation</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
          <Download size={16} className="text-gray-500" /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Donor</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((t, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm font-bold text-gray-900">{t.amount}</td>
                <td className="py-4 px-6 text-sm text-gray-600 font-medium">{t.date}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{t.method}</td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                    {t.campaign}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusStyle(t.status)}`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Dashboard ---

function Dashboard() {
  return (
    <AdminLayout>
      <div className="min-h-screen font-sans text-gray-900">

        {/* Header Section */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-500 mb-2">
            <span className="hover:text-gray-800 cursor-pointer transition-colors">Admin</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="font-medium text-gray-900">Overview</span>
          </nav>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-gray-500 mt-1 text-lg">Detailed overview of foundation performance.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium shadow-sm transition-all text-sm">
                View Reports
              </button>
              <button className="px-4 py-2 bg-[#0A1229] hover:bg-[#1a2540] text-white rounded-lg font-medium shadow-lg shadow-gray-200 transition-all text-sm flex items-center gap-2">
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <StatCard
            title="Total Donations"
            value="$15,430"
            trend="+12.5%"
            trendType="up"
            icon={DollarSign}
            color="bg-emerald-500"
            chartData={[5, 12, 10, 18, 15, 25, 22, 30]}
          />
          <StatCard
            title="New Events"
            value="12"
            trend="+8.2%"
            trendType="up"
            icon={Calendar}
            color="bg-indigo-500"
            chartData={[8, 6, 10, 12, 8, 15]}
          />
          <StatCard
            title="Active Programs"
            value="8"
            trend="+2.4%"
            trendType="up"
            icon={Layers}
            color="bg-blue-500"
            chartData={[3, 5, 4, 6, 7, 8]}
          />
          <StatCard
            title="Pending Cases"
            value="45"
            trend="-2.4%"
            trendType="down"
            icon={Activity}
            color="bg-rose-500"
            chartData={[30, 25, 28, 20, 15, 12, 10]}
          />
          <StatCard
            title="Volunteers"
            value="120"
            trend="+18%"
            trendType="up"
            icon={Users}
            color="bg-orange-500"
            chartData={[50, 60, 75, 80, 95, 110, 120]}
          />
        </div>

        {/* Content Modules */}
        <DonationTable />

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200 pt-6 flex justify-between items-center text-sm text-gray-500">
          <p>&copy; 2024 Rafahiyah Foundation. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Support</a>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default Dashboard;
