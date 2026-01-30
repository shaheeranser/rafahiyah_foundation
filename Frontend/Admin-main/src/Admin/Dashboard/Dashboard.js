import React from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

// --- Components ---

const StatCard = ({ title, value, subtext, trend, trendType, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
    </div>

    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{value}</h3>
      {/* Assuming the user intended to change the color of the existing title paragraph or add a new label.
          The provided snippet was syntactically incorrect. I'm interpreting "Update Modal labels to red"
          as changing the color of the StatCard's title label/paragraph. */}
      <p className="text-sm text-[#8B2D1B] font-medium mb-3">{title}</p>
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

  const handleExportPDF = async () => {
    try {
      setLoading(true); // Reuse existing loading state or create a specific one if needed. 
      // Existing loading state in component is for initial fetch, might hide the dashboard. 
      // Better to have a separate state or just accept full screen loader for now. 
      // Given the "freeze", a full screen loader (which existing loading=true does) is actually good feedback.

      const doc = new jsPDF();

      // Helper to compress image
      const compressImage = (url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxWidth = 300; // Resize to thumbnail size
            const maxHeight = 300;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG 0.7
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          img.onerror = (e) => resolve(null); // Resolve null on error to keep going
          img.src = url;
        });
      };

      // Use transactions directly, but FORCE slice to 10 to be absolutely sure.
      // The user reported seeing 109 records, which implies standard slice might have been missed or state is different.
      const allDonations = transactions.slice(0, 10);
      console.log("Exporting records:", allDonations.length, allDonations);

      const tableColumn = ["Donor", "Amount", "Date", "Method", "Campaign", "Proof/Receipt"];
      const tableRows = [];

      for (const d of allDonations) {
        let proofImage = null;
        let proofUrl = d.paymentProof
          ? `http://localhost:8000/${d.paymentProof.replace(/\\/g, '/')}`
          : (d.receiptUrl || d.receipt ? `http://localhost:8000/api/${d.receiptUrl || d.receipt}` : null);

        if (proofUrl) {
          try {
            // Use our new compress helper
            proofImage = await compressImage(proofUrl);
          } catch (err) {
            console.error("Error loading image for PDF:", err);
            proofImage = "Error";
          }
        }

        const rowData = [
          d.user?.name || d.fullName || 'Anonymous',
          formatAmount(d.amount),
          new Date(d.createdAt || d.date).toLocaleDateString(),
          d.paymentMethod,
          `${d.cause} - ${d.purpose}`,
          { content: '', image: proofImage } // Pass as object so text is empty
        ];
        tableRows.push(rowData);
      }

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          minCellHeight: 20,
          valign: 'middle',
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 40 },
          5: { cellWidth: 25 }
        },
        didDrawCell: (data) => {
          if (data.column.index === 5 && data.cell.section === 'body') {
            const image = data.cell.raw?.image; // Access image from custom object
            if (image && typeof image === 'string' && image.startsWith('data:image')) {
              try {
                // Fixed thumbnail size
                const imgWidth = 15;
                const imgHeight = 15;

                // Center image in cell
                const posX = data.cell.x + (data.cell.width - imgWidth) / 2;
                const posY = data.cell.y + (data.cell.height - imgHeight) / 2;

                let format = 'JPEG';
                if (image.includes('image/png')) format = 'PNG';
                else if (image.includes('image/webp')) format = 'WEBP';

                doc.addImage(image, format, posX, posY, imgWidth, imgHeight);
              } catch (imgError) {
                // Silent fail
              }
            }
          }
        }
      });

      doc.text("Donations Report", 14, 15);
      doc.save("dashboard_report_FIXED_FINAL.pdf");

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
      currency: 'PKR'
    }).format(amount || 0).replace('PKR', 'PKR ');
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
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <Download size={16} className="text-gray-500" /> Export PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Donor</th>
              <th className="py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Amount</th>
              <th className="py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Date</th>
              <th className="py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Method</th>
              <th className="py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Campaign</th>
              <th className="py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider text-right">Actions</th>
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
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount).replace('PKR', 'PKR ');
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
              {/* Actions Removed */}
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
            {/* Footer Links Removed */}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

export default Dashboard;
