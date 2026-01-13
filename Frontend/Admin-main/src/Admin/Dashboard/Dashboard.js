import React from 'react';
import axios from 'axios';
import { AuthToken } from "../../Api/Api";
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


// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add token to every request
api.interceptors.request.use((config) => {
  if (AuthToken) {
    config.headers.Authorization = `Bearer ${AuthToken()}`;
  }
  return config;
});

const DonationTable = () => {
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await api.get('/donations/all');
        // Sort by date (newest first) and take top 10
        const sortedDonations = response.data
          .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
          .slice(0, 10);
        setTransactions(sortedDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Verified":
      case "Approved": return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "Pending": return "bg-amber-50 text-amber-700 border border-amber-100";
      case "Rejected": return "bg-rose-50 text-rose-700 border border-rose-100";
      default: return "bg-gray-50 text-gray-700 border border-gray-100";
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm mt-8 overflow-hidden p-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
            {transactions.length > 0 ? (
              transactions.map((t, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center text-xs font-bold uppercase">
                        {(t.user?.name || t.fullName || 'A').charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{t.user?.name || t.fullName || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">{t.user?.email || t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">{formatAmount(t.amount)}</td>
                  <td className="py-4 px-6 text-sm text-gray-600 font-medium">{formatDate(t.createdAt || t.date)}</td>
                  <td className="py-4 px-6 text-sm text-gray-600 capitalize">{t.paymentMethod}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      {t.cause}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusStyle(t.status)}`}>
                      {t.status || 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">No recent donations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Dashboard ---

// --- Main Dashboard ---

function Dashboard() {
  const [stats, setStats] = React.useState({
    totalDonations: 0,
    totalDonationsGrowth: 0,
    newEvents: 0,
    newEventsGrowth: 0,
    activePrograms: 0,
    activeProgramsGrowth: 0, // Placeholder as historical data is harder for status
    pendingCases: 0,
    pendingCasesGrowth: 0,
    totalVolunteers: 0,
    totalVolunteersGrowth: 0
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [donationsRes, eventsRes, programsRes, casesRes, volunteersRes] = await Promise.all([
          api.get('/donations/all'),
          api.get('/events/getallevent'),
          api.get('/programs/getallprogram'),
          api.get('/cases'),
          api.get('/volunteers')
        ]);

        const donations = donationsRes.data;
        const events = eventsRes.data.events;
        const programs = programsRes.data.programs;
        const cases = casesRes.data.data;
        const volunteers = volunteersRes.data.data;

        // --- Calculate Stats ---
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const isThisMonth = (dateString) => {
          if (!dateString) return false;
          const d = new Date(dateString);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        };

        const isLastMonth = (dateString) => {
          if (!dateString) return false;
          const d = new Date(dateString);
          return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
        };

        // 1. Donations
        const totalDonations = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        const donationsThisMonth = donations.filter(d => isThisMonth(d.createdAt || d.date)).reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        const donationsLastMonth = donations.filter(d => isLastMonth(d.createdAt || d.date)).reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        const donationsGrowth = donationsLastMonth === 0 ? (donationsThisMonth > 0 ? 100 : 0) : ((donationsThisMonth - donationsLastMonth) / donationsLastMonth) * 100;

        // 2. Events (Total vs Created This Month) - Using "New Events" as created this month
        const newEventsCount = events.filter(e => isThisMonth(e.createdAt || e.date)).length; // Assuming createdAt or date used for creation
        const newEventsLastMonth = events.filter(e => isLastMonth(e.createdAt || e.date)).length;
        const eventsGrowth = newEventsLastMonth === 0 ? (newEventsCount > 0 ? 100 : 0) : ((newEventsCount - newEventsLastMonth) / newEventsLastMonth) * 100;

        // 3. Active Programs
        const activeProgramsCount = programs.filter(p => new Date(p.endingDate) >= now).length;
        // Growth logic: Hard to know previous active without history. Just showing current active.
        // Or simplified: newly started this month vs last month?
        // Let's use Programs Created This Month for growth indicator, but Value is Active Count.
        const programsCreatedThisMonth = programs.filter(p => isThisMonth(p.createdAt || p.startingDate)).length;
        const programsCreatedLastMonth = programs.filter(p => isLastMonth(p.createdAt || p.startingDate)).length;
        const programsGrowth = programsCreatedLastMonth === 0 ? (programsCreatedThisMonth > 0 ? 100 : 0) : ((programsCreatedThisMonth - programsCreatedLastMonth) / programsCreatedLastMonth) * 100;

        // 4. Pending Cases (Active Cases)
        const pendingCasesCount = cases.filter(c => c.status === 'active').length; // Model default is 'active'
        // Growth: Cases created this month vs last month
        const casesCreatedThisMonth = cases.filter(c => isThisMonth(c.createdAt)).length;
        const casesCreatedLastMonth = cases.filter(c => isLastMonth(c.createdAt)).length;
        const casesGrowth = casesCreatedLastMonth === 0 ? (casesCreatedThisMonth > 0 ? 100 : 0) : ((casesCreatedThisMonth - casesCreatedLastMonth) / casesCreatedLastMonth) * 100;

        // 5. Volunteers
        const totalVolunteers = volunteers.length;
        const volunteersThisMonth = volunteers.filter(v => isThisMonth(v.createdAt)).length;
        const volunteersLastMonth = volunteers.filter(v => isLastMonth(v.createdAt)).length;
        const volunteersGrowth = volunteersLastMonth === 0 ? (volunteersThisMonth > 0 ? 100 : 0) : ((volunteersThisMonth - volunteersLastMonth) / volunteersLastMonth) * 100;


        setStats({
          totalDonations,
          totalDonationsGrowth: donationsGrowth,
          newEvents: newEventsCount,
          newEventsGrowth: eventsGrowth,
          activePrograms: activeProgramsCount,
          activeProgramsGrowth: programsGrowth,
          pendingCases: pendingCasesCount,
          pendingCasesGrowth: casesGrowth,
          totalVolunteers: totalVolunteers,
          totalVolunteersGrowth: volunteersGrowth
        });

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatGrowth = (val) => {
    const num = Number(val);
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
  };

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
            value={formatCurrency(stats.totalDonations)}
            trend={formatGrowth(stats.totalDonationsGrowth)}
            trendType={stats.totalDonationsGrowth >= 0 ? "up" : "down"}
            icon={DollarSign}
            color="bg-emerald-500"
            chartData={[5, 12, 10, 18, 15, 25, 22, 30]} // Placeholder sparkline
          />
          <StatCard
            title="New Events (Month)"
            value={stats.newEvents}
            trend={formatGrowth(stats.newEventsGrowth)}
            trendType={stats.newEventsGrowth >= 0 ? "up" : "down"}
            icon={Calendar}
            color="bg-indigo-500"
            chartData={[8, 6, 10, 12, 8, 15]}
          />
          <StatCard
            title="Active Programs"
            value={stats.activePrograms}
            trend={formatGrowth(stats.activeProgramsGrowth)}
            trendType={stats.activeProgramsGrowth >= 0 ? "up" : "down"}
            icon={Layers}
            color="bg-blue-500"
            chartData={[3, 5, 4, 6, 7, 8]}
          />
          <StatCard
            title="Active Cases"
            value={stats.pendingCases}
            trend={formatGrowth(stats.pendingCasesGrowth)}
            trendType={stats.pendingCasesGrowth >= 0 ? "up" : "down"}
            icon={Activity}
            color="bg-rose-500"
            chartData={[30, 25, 28, 20, 15, 12, 10]}
          />
          <StatCard
            title="Total Volunteers"
            value={stats.totalVolunteers}
            trend={formatGrowth(stats.totalVolunteersGrowth)}
            trendType={stats.totalVolunteersGrowth >= 0 ? "up" : "down"}
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
