import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faDownload,
  faEye,
  faCheckCircle,
  faTimesCircle,
  faFileUpload,
  faEdit,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";

// --- Components ---

// 1. Current Cases Card
const CaseCard = ({ data, onClick }) => {
  const percentage = Math.min(100, Math.round((data.amountCollected / data.amountRequired) * 100)) || 0;

  return (
    <div
      onClick={() => onClick(data)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative cursor-pointer"
    >
      <div className="h-40 bg-gray-100 relative overflow-hidden">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop'}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm">
          #{data.caseNo}
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50/90 backdrop-blur-sm text-blue-600 border border-blue-100 shadow-sm">
            {data.category || 'General'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          {/* Title now below image */}
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{data.title}</h3>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Raised: ${data.amountCollected}</span>
            <span>Goal: ${data.amountRequired}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex -space-x-2 overflow-hidden">
          <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/women/1.jpg" alt="" />
          <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/men/2.jpg" alt="" />
          <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://randomuser.me/api/portraits/women/3.jpg" alt="" />
        </div>
      </div>
    </div>
  );
};

// 2. Table for Completed/Dropped
const HistoryTable = ({ data, emptyMessage, isDropped }) => {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-gray-400 border border-dashed rounded-xl bg-gray-50">{emptyMessage}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-3 px-6 text-left text-xs font-bold text-gray-400 uppercase">Case No</th>
              <th className="py-3 px-6 text-left text-xs font-bold text-gray-400 uppercase">Title</th>
              <th className="py-3 px-6 text-left text-xs font-bold text-gray-400 uppercase">Category</th>
              <th className="py-3 px-6 text-left text-xs font-bold text-gray-400 uppercase">Date Ended</th>
              <th className="py-3 px-6 text-left text-xs font-bold text-gray-400 uppercase">{isDropped ? 'Reason' : 'Amount Raised'}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-600">#{item.caseNo}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-800">{item.title}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{item.category}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{new Date(item.updatedAt || Date.now()).toLocaleDateString('en-GB')}</td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {isDropped ? 'Cancelled by Admin' : `$${item.amountCollected}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Posts = () => {
  // State
  const [activeCases, setActiveCases] = useState([]);
  const [completedCases, setCompletedCases] = useState([]);
  const [droppedCases, setDroppedCases] = useState([]);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Selected Item
  const [selectedCase, setSelectedCase] = useState(null);

  // Forms
  const [newCaseForm, setNewCaseForm] = useState({
    caseNo: '',
    category: 'Financial Help',
    date: new Date().toISOString().split('T')[0],
    amountRequired: '',
    title: '',
    description: '',
    picture: null
  });

  const [completionForm, setCompletionForm] = useState({
    finalAmount: '',
    docs: null,
    receipt: null
  });

  // Mock Initialization
  useEffect(() => {
    // Generate some starter data with images
    const startData = [
      { id: 1, caseNo: '1001', category: 'Medical Assistance', title: 'Urgent Surgery for Child', description: 'Requires heart surgery immediately.', amountRequired: 5000, amountCollected: 3200, createdAt: new Date().toISOString(), status: 'active', image: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?q=80&w=2070&auto=format&fit=crop' },
      { id: 2, caseNo: '1002', category: 'Fee Assistance', title: 'University Fees Support', description: 'Student needs help with semester fees.', amountRequired: 1200, amountCollected: 450, createdAt: new Date().toISOString(), status: 'active', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop' },
      { id: 3, caseNo: '1003', category: 'Financial Help', title: 'Widow Support Fund', description: 'Monthly ration support.', amountRequired: 300, amountCollected: 300, createdAt: new Date().toISOString(), status: 'completed', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop' }
    ];

    setActiveCases(startData.filter(c => c.status === 'active'));
    setCompletedCases(startData.filter(c => c.status === 'completed'));
    setDroppedCases(startData.filter(c => c.status === 'dropped'));
  }, []);

  // Handlers
  const handleCreateOpen = () => {
    setNewCaseForm({
      caseNo: Math.floor(1000 + Math.random() * 9000), // Auto-generate
      category: 'Financial Help',
      date: new Date().toISOString().split('T')[0],
      amountRequired: '',
      title: '',
      description: '',
      picture: null
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    // Logic to add to active cases
    const newCase = {
      id: Date.now(),
      ...newCaseForm,
      amountCollected: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop' // Default image for new cases
    };
    setActiveCases([newCase, ...activeCases]);
    setShowCreateModal(false);
    Swal.fire('Created!', 'New case has been created successfully.', 'success');
  };

  const handleCardClick = (caseItem) => {
    setSelectedCase(caseItem);
    setShowDetailModal(true);
  };

  const handleDropCase = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to drop this case?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Drop it'
    }).then((result) => {
      if (result.isConfirmed) {
        // Move from active to dropped
        setDroppedCases([selectedCase, ...droppedCases]);
        setActiveCases(activeCases.filter(c => c.id !== selectedCase.id));
        setShowDetailModal(false);
        Swal.fire('Dropped!', 'Case has been moved to dropped list.', 'success');
      }
    })
  };

  const handleCompleteStart = () => {
    setShowDetailModal(false);
    setCompletionForm({ finalAmount: selectedCase.amountCollected, docs: null, receipt: null });
    setShowCompleteModal(true);
  };

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    // Move from active to completed
    const completedCase = { ...selectedCase, amountCollected: completionForm.finalAmount, status: 'completed', updatedAt: new Date().toISOString() };
    setCompletedCases([completedCase, ...completedCases]);
    setActiveCases(activeCases.filter(c => c.id !== selectedCase.id));
    setShowCompleteModal(false);
    Swal.fire('Completed!', 'Case closed successfully.', 'success');
  };

  const handleExport = (data, filename) => {
    if (!data.length) return;
    const headers = ['Case No', 'Title', 'Category', 'Date', 'Amount Required', 'Amount Collected'];
    const rows = data.map(c => [
      c.caseNo, c.title, c.category, new Date(c.createdAt).toLocaleDateString(), c.amountRequired, c.amountCollected
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-handwriting text-gray-800" style={{ fontFamily: '"Patrick Hand", cursive' }}>Cases Management</h1>
          </div>
          <button
            onClick={handleCreateOpen}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg shadow-gray-200"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create New Case
          </button>
        </div>

        {/* Current Cases Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 font-handwriting">Current Cases</h2>
          {activeCases.length === 0 ? (
            <div className="p-8 text-center text-gray-400 border border-dashed rounded-xl bg-gray-50">No active cases. Create one to get started.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCases.map(c => <CaseCard key={c.id} data={c} onClick={handleCardClick} />)}
            </div>
          )}
        </div>

        {/* Completed Cases */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 font-handwriting">Completed Cases</h2>
            <button onClick={() => handleExport(completedCases, 'completed_cases.csv')} className="text-sm text-gray-500 hover:text-gray-800 flex items-center border px-3 py-1 rounded bg-white">
              <FontAwesomeIcon icon={faDownload} className="mr-2" /> Export CSV
            </button>
          </div>
          <HistoryTable data={completedCases} emptyMessage="No completed cases yet." />
        </div>

        {/* Dropped Cases */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 font-handwriting">Dropped Cases</h2>
            <button onClick={() => handleExport(droppedCases, 'dropped_cases.csv')} className="text-sm text-gray-500 hover:text-gray-800 flex items-center border px-3 py-1 rounded bg-white">
              <FontAwesomeIcon icon={faDownload} className="mr-2" /> Export CSV
            </button>
          </div>
          <HistoryTable data={droppedCases} emptyMessage="No dropped cases found." isDropped />
        </div>

      </div>

      {/* --- MODALS --- */}

      {/* 1. Create Case Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Create New Case</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faTimesCircle} size="lg" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Case Number</label>
                  <input type="text" value={newCaseForm.caseNo} disabled className="w-full bg-gray-100 border border-gray-200 rounded p-2 text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCaseForm.category}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, category: e.target.value })}
                  >
                    <option>Financial Help</option>
                    <option>Fee Assistance</option>
                    <option>Medical Assistance</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded p-2 text-sm" value={newCaseForm.date} onChange={e => setNewCaseForm({ ...newCaseForm, date: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount Required</label>
                  <input type="number" placeholder="$0.00" className="w-full border border-gray-300 rounded p-2 text-sm" value={newCaseForm.amountRequired} onChange={e => setNewCaseForm({ ...newCaseForm, amountRequired: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                <input type="text" placeholder="e.g. Heart Surgery Support" className="w-full border border-gray-300 rounded p-2 text-sm" value={newCaseForm.title} onChange={e => setNewCaseForm({ ...newCaseForm, title: e.target.value })} required />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea rows="3" placeholder="Case details..." className="w-full border border-gray-300 rounded p-2 text-sm" value={newCaseForm.description} onChange={e => setNewCaseForm({ ...newCaseForm, description: e.target.value })} required ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Picture (Optional)</label>
                <div className="border border-dashed border-gray-300 rounded p-4 text-center text-gray-400 text-sm hover:bg-gray-50 cursor-pointer">
                  <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                  Click to upload image
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-black transition-colors">
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Case Details Modal (View/Drop/Complete) */}
      {showDetailModal && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row max-h-[90vh]">

            {/* Close Button Mobile */}
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 md:hidden z-10"
            >
              <FontAwesomeIcon icon={faTimesCircle} size="lg" />
            </button>

            {/* Left Column: Image & Description */}
            <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col gap-6 overflow-y-auto">
              {/* Image Box */}
              <div className="bg-gray-200 rounded-xl w-full aspect-video flex items-center justify-center overflow-hidden relative group">
                <img
                  src={selectedCase.image}
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop'}
                />
              </div>

              {/* Description Box */}
              <div className="bg-gray-200 rounded-xl w-full p-4 flex-1 min-h-[150px]">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Description Text</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedCase.description}
                </p>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto">

              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{selectedCase.title}</h2>
                  </div>
                  <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 hidden md:block">
                    <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                  </button>
                </div>

                {/* Case Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500 uppercase w-32">case number:</span>
                    <span className="text-gray-800 font-medium">#{selectedCase.caseNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500 uppercase w-32">category:</span>
                    <span className="text-gray-800 font-medium">{selectedCase.category}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-2"></div>

                {/* Financials */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500 uppercase">total amount:</span>
                    <span className="font-bold text-gray-800 text-lg">${selectedCase.amountRequired}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500 uppercase">collected amount:</span>
                    <span className="font-bold text-green-600 text-lg">${selectedCase.amountCollected}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500 uppercase">remaining amount:</span>
                    <span className="font-bold text-red-500 text-lg">
                      ${(selectedCase.amountRequired || 0) - (selectedCase.amountCollected || 0)}
                    </span>
                  </div>
                </div>

                {/* Last Date (Optional Placeholder as per design) */}
                <div className="mt-4">
                  <div className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1.5 rounded w-fit mx-auto md:mx-0">
                    last date (optional)
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={handleDropCase}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-bold transition-colors shadow-sm"
                >
                  Drop
                </button>
                <button
                  onClick={handleCompleteStart}
                  className="w-full bg-[#8B4513] hover:bg-[#6F370F] text-white py-3 rounded-xl font-bold transition-colors shadow-sm"
                >
                  Complete
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. Completion Process Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Completion Process</h3>
              <p className="text-xs text-gray-400 mb-6 font-bold uppercase">Finalizing Case #{selectedCase.caseNo}</p>

              <form onSubmit={handleCompleteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Amount Collected</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded p-2 text-sm font-bold text-gray-800"
                    value={completionForm.finalAmount}
                    onChange={(e) => setCompletionForm({ ...completionForm, finalAmount: e.target.value })}
                    required
                  />
                </div>

                <div className="border border-dashed border-gray-300 rounded p-3 text-center text-gray-500 text-xs hover:bg-gray-50 cursor-pointer transition-colors">
                  <FontAwesomeIcon icon={faFileUpload} className="mb-1 block mx-auto text-lg text-gray-300" />
                  Upload Documents
                </div>

                <div className="border border-dashed border-gray-300 rounded p-3 text-center text-gray-500 text-xs hover:bg-gray-50 cursor-pointer transition-colors">
                  <FontAwesomeIcon icon={faFileUpload} className="mb-1 block mx-auto text-lg text-gray-300" />
                  Upload Receipt
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-black transition-colors">
                    Submit & Close Case
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default Posts;