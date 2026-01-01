import React from 'react';
import AdminLayout from "../../layouts/AdminLayout";
import { Download, MoreHorizontal } from "lucide-react";

// Mock Data for Charts (Simple SVG Paths)
const Sparkline = ({ color = "#10B981", data }) => (
  <svg width="100%" height="40" viewBox="0 0 100 40" className="overflow-visible">
    <path
      d={data}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StatCard = ({ title, value, subtext, trend, trendType, chartData, chartColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <span className="text-gray-500 text-sm font-medium">{title}</span>
      <button className="text-gray-300 hover:text-gray-500">
        <MoreHorizontal size={16} />
      </button>
    </div>

    <div className="flex items-end justify-between relative z-10">
      <div>
        <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
        <div className={`flex items-center text-xs font-medium ${trendType === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trendType === 'up' ? '↗' : '↘'} {trend}
        </div>
        <span className="text-xs text-gray-400 mt-1 block">{subtext}</span>
      </div>
      <div className="w-24 h-10 mb-1">
        <Sparkline color={chartColor} data={chartData} />
      </div>
    </div>
  </div>
);

const DonationTable = () => {
  const transactions = [
    { name: "John Doe", email: "john@example.com", amount: "$500.00", date: "10/03/2024", method: "Credit Card", campaign: "Ramadan Drive", status: "Approved" },
    { name: "Sarah Smith", email: "sarah@example.com", amount: "$120.00", date: "12/03/2024", method: "PayPal", campaign: "Education Fund", status: "Approved" },
    { name: "Ahmed Khan", email: "ahmed@example.com", amount: "$1,000.00", date: "14/03/2024", method: "Bank Transfer", campaign: "Medical Aid", status: "Pending" },
    { name: "Emily Davis", email: "emily@example.com", amount: "$50.00", date: "15/03/2024", method: "Credit Card", campaign: "General", status: "Approved" },
    { name: "Michael Brown", email: "mike@example.com", amount: "$250.00", date: "18/03/2024", method: "PayPal", campaign: "Winter Relief", status: "Rejected" },
    { name: "Ayesha Ali", email: "ayesha@example.com", amount: "$300.00", date: "20/03/2024", method: "Credit Card", campaign: "Orphan Support", status: "Approved" },
    { name: "David Wilson", email: "david@example.com", amount: "$75.00", date: "22/03/2024", method: "Stripe", campaign: "General", status: "Approved" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-emerald-100 text-emerald-600";
      case "Pending": return "bg-amber-100 text-amber-600";
      case "Rejected": return "bg-rose-100 text-rose-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Donation History</h3>
          <p className="text-sm text-gray-400 mt-1">Recent contributions from all channels (Static)</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0A1229] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <th className="pb-4 font-medium pl-2">Donor Name</th>
              <th className="pb-4 font-medium">Amount</th>
              <th className="pb-4 font-medium">Date</th>
              <th className="pb-4 font-medium">Method</th>
              <th className="pb-4 font-medium">Campaign</th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {transactions.map((t, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                <td className="py-4 pl-2 border-b border-gray-50">
                  <div className="font-semibold text-gray-800">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.email}</div>
                </td>
                <td className="py-4 border-b border-gray-50 font-bold text-gray-800">{t.amount}</td>
                <td className="py-4 border-b border-gray-50">{t.date}</td>
                <td className="py-4 border-b border-gray-50">{t.method}</td>
                <td className="py-4 border-b border-gray-50">{t.campaign}</td>
                <td className="py-4 border-b border-gray-50">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusColor(t.status)}`}>
                    • {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function Dashboard() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50/50 -m-6 p-8"> {/* Negative margin to counteract default padding if needed, or just normal layout */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Donations"
            value="$15,430"
            subtext="Target Audience"
            trend="+12.5%"
            trendType="up"
            chartData="M0 35 L15 32 L30 38 L45 25 L60 30 L75 20 L90 25 L100 15"
            chartColor="#10B981"
          />
          <StatCard
            title="Total Events"
            value="12"
            subtext="Overall"
            trend="+8.2%"
            trendType="up"
            chartData="M0 35 L20 35 L40 30 L60 32 L80 20 L100 15"
            chartColor="#10B981"
          />
          <StatCard
            title="Total Programs"
            value="8"
            subtext="Completed"
            trend="+4.6%"
            trendType="up"
            chartData="M0 38 L30 38 L50 30 L70 25 L85 20 L100 15"
            chartColor="#10B981"
          />
          <StatCard
            title="Total Cases"
            value="45"
            subtext="Pending"
            trend="-2.4%"
            trendType="down"
            chartData="M0 10 L15 12 L30 10 L45 25 L60 15 L75 28 L90 30 L100 35"
            chartColor="#F43F5E"
          />
          <StatCard
            title="Volunteers"
            value="120"
            subtext="Active"
            trend="+18%"
            trendType="up"
            chartData="M0 35 L20 32 L40 28 L60 20 L80 15 L90 18 L100 10"
            chartColor="#10B981"
          />
        </div>

        {/* Donation History Table */}
        <DonationTable />
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
