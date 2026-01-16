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
  faTrash,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";
import Domain from "../../Api/Api";

// --- Components ---

// 1. Current Cases Card
const CaseCard = ({ data, onClick }) => {
  const percentage = Math.min(100, Math.round((data.amountCollected / data.amountRequired) * 100)) || 0;

  // Image handling
  const imageUrl = data.image
    ? `http://localhost:8000/${data.image.replace(/\\/g, '/')}`
    : 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop';

  return (
    <div
      onClick={() => onClick(data)}
      className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-lg transition-all group relative cursor-pointer"
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={data.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop'}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm">
          #{data.caseNo}
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-50/90 backdrop-blur-sm text-indigo-600 border border-indigo-100 shadow-sm">
            {data.category || 'General'}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          {/* Title now below image */}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{data.title}</h3>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Raised: ${data.amountCollected}</span>
            <span>Goal: ${data.amountRequired}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Footer with Actions */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={(e) => { e.stopPropagation(); onClick(data, 'view'); }}
          className="text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded"
          title="View Details"
        >
          <FontAwesomeIcon icon={faEye} />
          <span>View</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onClick(data, 'edit'); }}
            className="text-gray-400 hover:text-emerald-600 transition-colors p-2 hover:bg-emerald-50 rounded-full"
            title="Edit Case"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(data, 'delete'); }}
            className="text-gray-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-full"
            title="Delete Case"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Table for Completed/Dropped
const HistoryTable = ({ data, emptyMessage, isDropped, onAction }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.action-menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-gray-400 border border-dashed rounded-xl bg-gray-50">{emptyMessage}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden min-h-[300px]"> {/* Added min-h to allow dropdown space */}
      <div className="overflow-x-visible"> {/* Changed to visible to allow dropdown overflow if possible, else we rely on enough height */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-3 px-6 text-left text-xs font-bold text-gray-500 uppercase">Case No</th>
              <th className="py-3 px-6 text-left text-xs font-bold text-gray-500 uppercase">Title</th>
              <th className="py-3 px-6 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
              <th className="py-3 px-6 text-left text-xs font-bold text-gray-500 uppercase">Date Ended</th>
              <th className="py-3 px-6 text-left text-xs font-bold text-gray-500 uppercase">{isDropped ? 'Reason' : 'Amount Raised'}</th>
              <th className="py-3 px-6 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="overflow-visible">
            {data.map((item) => (
              <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors relative group">
                <td className="py-4 px-6 text-sm text-gray-600">#{item.caseNo}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-900">{item.title}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{item.category}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{new Date(item.updatedAt || Date.now()).toLocaleDateString('en-GB')}</td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {isDropped ? 'Cancelled by Admin' : `$${item.amountCollected}`}
                </td>
                <td className="py-4 px-6 text-right relative action-menu-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === item._id ? null : item._id);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>

                  {openMenuId === item._id && (
                    <div className="absolute right-8 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 text-left transform origin-top-right animate-fade-in-up">
                      <button
                        onClick={() => { onAction(item, 'view'); setOpenMenuId(null); }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-4" /> View Details
                      </button>
                      <button
                        onClick={() => { onAction(item, 'edit'); setOpenMenuId(null); }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4" /> Edit
                      </button>
                      <button
                        onClick={() => { onAction(item, 'mark_incomplete'); setOpenMenuId(null); }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faTimesCircle} className="w-4" /> Mark as Incomplete
                      </button>
                    </div>
                  )}
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
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Added search state

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
    amountRequired: '',
    amountCollected: '',
    title: '',
    description: '',
    picture: null
  });

  const [completionForm, setCompletionForm] = useState({
    finalAmount: '',
    docs: null,
    receipt: null
  });

  // Fetch Cases
  const fetchCases = async () => {
    try {
      const response = await axios.get(`${Domain()}/cases`);
      if (response.data.success) {
        const allCases = response.data.data;
        setActiveCases(allCases.filter(c => c.status === 'active'));
        setCompletedCases(allCases.filter(c => c.status === 'completed'));
        setDroppedCases(allCases.filter(c => c.status === 'dropped'));
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
      Swal.fire('Error', 'Failed to fetch cases.', 'error');
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Filter Logic
  const filteredActiveCases = activeCases.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(c.caseNo).includes(searchTerm)
  );

  const filteredCompletedCases = completedCases.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(c.caseNo).includes(searchTerm)
  );

  const filteredDroppedCases = droppedCases.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(c.caseNo).includes(searchTerm)
  );

  // Handlers
  const handleCreateOpen = () => {
    setEditId(null);
    setNewCaseForm({
      caseNo: Math.floor(1000 + Math.random() * 9000), // Auto-generate
      category: 'Financial Help',
      amountRequired: '',
      amountCollected: '',
      title: '',
      description: '',
      picture: null
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('caseNo', newCaseForm.caseNo);
    formData.append('category', newCaseForm.category);
    formData.append('amountRequired', newCaseForm.amountRequired);
    formData.append('amountCollected', newCaseForm.amountCollected || 0);
    formData.append('title', newCaseForm.title);
    formData.append('description', newCaseForm.description);
    if (newCaseForm.picture instanceof File) {
      formData.append('image', newCaseForm.picture);
    }

    try {
      if (editId) {
        // Update
        await axios.put(`${Domain()}/cases/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Updated!', 'Case has been updated successfully.', 'success');
      } else {
        // Create
        await axios.post(`${Domain()}/cases`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Created!', 'New case has been created successfully.', 'success');
      }
      setShowCreateModal(false);
      fetchCases();
    } catch (error) {
      console.error("Error saving case:", error);
      Swal.fire('Error', 'Failed to save case.', 'error');
    }
  };

  const handleCardAction = (caseItem, action = 'view') => {
    if (action === 'view') {
      setSelectedCase(caseItem);
      setShowDetailModal(true);
    } else if (action === 'edit') {
      setEditId(caseItem._id);
      setNewCaseForm({
        caseNo: caseItem.caseNo,
        category: caseItem.category,
        amountRequired: caseItem.amountRequired,
        amountCollected: caseItem.amountCollected,
        title: caseItem.title,
        description: caseItem.description,
        picture: null // Reset picture input, user can upload new one if they want
      });
      setShowCreateModal(true);
    } else if (action === 'delete') {
      Swal.fire({
        title: 'Delete Case?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(`${Domain()}/cases/${caseItem._id}`);
            Swal.fire('Deleted!', 'Case has been deleted.', 'success');
            fetchCases();
          } catch (error) {
            console.error("Error deleting case:", error);
            Swal.fire('Error', 'Failed to delete case.', 'error');
          }
        }
      });
    }
  };

  const handleDropCase = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to drop this case?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Drop it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`${Domain()}/cases/${selectedCase._id}/status`, { status: 'dropped' });
          Swal.fire('Dropped!', 'Case has been moved to dropped list.', 'success');
          setShowDetailModal(false);
          fetchCases();
        } catch (error) {
          console.error("Error dropping case:", error);
          Swal.fire('Error', 'Failed to drop case.', 'error');
        }
      }
    })
  };

  const handleCompleteStart = () => {
    setShowDetailModal(false);
    setCompletionForm({ finalAmount: selectedCase.amountCollected, docs: null, receipt: null });
    setShowCompleteModal(true);
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${Domain()}/cases/${selectedCase._id}/status`, {
        status: 'completed',
        finalAmount: completionForm.finalAmount
      });
      Swal.fire('Completed!', 'Case closed successfully.', 'success');
      setShowCompleteModal(false);
      fetchCases();
    } catch (error) {
      console.error("Error completing case:", error);
      Swal.fire('Error', 'Failed to complete case.', 'error');
    }
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

  const handleTableAction = async (item, action) => {
    if (action === 'view') {
      handleCardAction(item, 'view');
    } else if (action === 'edit') {
      handleCardAction(item, 'edit');
    } else if (action === 'mark_incomplete') {
      Swal.fire({
        title: 'Mark as Incomplete?',
        text: "This case will be moved back to active cases.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, move it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${Domain()}/cases/${item._id}/status`, { status: 'active' });
            Swal.fire('Moved!', 'Case has been moved to active list.', 'success');
            fetchCases();
          } catch (error) {
            console.error("Error updating case:", error);
            Swal.fire('Error', 'Failed to update case.', 'error');
          }
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-6 py-8 font-sans">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cases Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage cases, track progress, and update statuses.</p>
          </div>
          <button
            onClick={handleCreateOpen}
            className="bg-[#0A1229] hover:bg-[#1a2540] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center transition-all shadow-lg shadow-gray-200"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create New Case
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200/60 mb-8 flex gap-4">
          <div className="relative flex-grow">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases by title or case number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Current Cases Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Current Cases</h2>
          {activeCases.length === 0 ? (
            <div className="p-12 text-center text-gray-400 border border-dashed rounded-xl bg-gray-50">No active cases. Create one to get started.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActiveCases.map(c => <CaseCard key={c._id} data={c} onClick={handleCardAction} />)}
            </div>
          )}
          {filteredActiveCases.length === 0 && activeCases.length > 0 && (
            <p className="text-gray-500 italic mt-4">No matching active cases found.</p>
          )}
        </div>

        {/* Completed Cases */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Completed Cases</h2>
            <button onClick={() => handleExport(completedCases, 'completed_cases.csv')} className="text-sm text-gray-500 hover:text-gray-800 flex items-center border px-3 py-1 rounded bg-white hover:bg-gray-50 transition-colors">
              <FontAwesomeIcon icon={faDownload} className="mr-2" /> Export CSV
            </button>
          </div>
          <HistoryTable
            data={filteredCompletedCases}
            emptyMessage="No completed cases yet."
            onAction={handleTableAction}
          />
        </div>

        {/* Dropped Cases */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Dropped Cases</h2>
            <button onClick={() => handleExport(droppedCases, 'dropped_cases.csv')} className="text-sm text-gray-500 hover:text-gray-800 flex items-center border px-3 py-1 rounded bg-white hover:bg-gray-50 transition-colors">
              <FontAwesomeIcon icon={faDownload} className="mr-2" /> Export CSV
            </button>
          </div>
          <HistoryTable
            data={filteredDroppedCases}
            emptyMessage="No dropped cases found."
            isDropped
            onAction={handleTableAction}
          />
        </div>

      </div>

      {/* --- MODALS --- */}

      {/* 1. Create Case Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">{editId ? 'Edit Case' : 'Create New Case'}</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FontAwesomeIcon icon={faTimesCircle} size="lg" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Case Number</label>
                  <input type="text" value={newCaseForm.caseNo} disabled className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                  <input type="text" placeholder="e.g. Heart Surgery Support" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={newCaseForm.title} onChange={e => setNewCaseForm({ ...newCaseForm, title: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea rows="3" placeholder="Case details..." className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={newCaseForm.description} onChange={e => setNewCaseForm({ ...newCaseForm, description: e.target.value })} required ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                <select
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  value={newCaseForm.category}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, category: e.target.value })}
                >
                  <option>Financial Help</option>
                  <option>Fee Assistance</option>
                  <option>Medical Assistance</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount Required</label>
                  <input type="number" placeholder="$0.00" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={newCaseForm.amountRequired} onChange={e => setNewCaseForm({ ...newCaseForm, amountRequired: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount Raised</label>
                  <input type="number" placeholder="$0.00" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" value={newCaseForm.amountCollected} onChange={e => setNewCaseForm({ ...newCaseForm, amountCollected: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Picture (Optional)</label>
                <div
                  className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400 text-sm hover:bg-gray-50 cursor-pointer relative transition-colors"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                  {newCaseForm.picture ? newCaseForm.picture.name : "Click to upload image"}
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files[0]) {
                        setNewCaseForm({ ...newCaseForm, picture: e.target.files[0] });
                      }
                    }}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-[#0A1229] hover:bg-[#1a2540] text-white py-3 rounded-lg font-medium transition-colors shadow-lg shadow-gray-200">
                  {editId ? 'Update Case' : 'Create Case'}
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
              <div className="bg-white rounded-xl w-full aspect-video flex items-center justify-center overflow-hidden relative group shadow-sm border border-gray-100">
                <img
                  src={selectedCase.image
                    ? `http://localhost:8000/${selectedCase.image.replace(/\\/g, '/')}`
                    : 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop'}
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop'}
                />
              </div>

              {/* Description Box */}
              <div className="bg-white border border-gray-200 rounded-xl w-full p-6 flex-1 min-h-[150px] shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Description</h4>
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
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">{selectedCase.title}</h2>
                  </div>
                  <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 hidden md:block transition-colors">
                    <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                  </button>
                </div>

                {/* Case Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase w-32">case number:</span>
                    <span className="text-gray-900 font-medium">#{selectedCase.caseNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase w-32">category:</span>
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">{selectedCase.category}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-2"></div>

                {/* Financials */}
                <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500 uppercase">total amount:</span>
                    <span className="font-bold text-gray-900 text-lg">${selectedCase.amountRequired}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-500 uppercase">collected amount:</span>
                    <span className="font-bold text-emerald-600 text-lg">${selectedCase.amountCollected}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, (selectedCase.amountCollected / selectedCase.amountRequired) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200/60">
                    <span className="font-bold text-gray-500 uppercase">remaining amount:</span>
                    <span className="font-bold text-rose-500 text-lg">
                      ${Math.max(0, (selectedCase.amountRequired || 0) - (selectedCase.amountCollected || 0))}
                    </span>
                  </div>
                </div>

                {/* Last Date (Optional Placeholder as per design) */}

              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-8">
                <button
                  onClick={handleDropCase}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 py-3 rounded-lg font-bold transition-all border border-rose-200"
                >
                  Drop Case
                </button>
                <button
                  onClick={handleCompleteStart}
                  className="w-full bg-[#0A1229] hover:bg-[#1a2540] text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-gray-200"
                >
                  Complete Case
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
              <h3 className="text-lg font-bold text-gray-900 mb-1">Completion Process</h3>
              <p className="text-xs text-gray-500 mb-6 font-bold uppercase">Finalizing Case #{selectedCase.caseNo}</p>

              <form onSubmit={handleCompleteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Amount Collected</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    value={completionForm.finalAmount}
                    onChange={(e) => setCompletionForm({ ...completionForm, finalAmount: e.target.value })}
                    required
                  />
                </div>

                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-xs hover:bg-gray-50 cursor-pointer transition-colors">
                  <FontAwesomeIcon icon={faFileUpload} className="mb-2 block mx-auto text-lg text-gray-300" />
                  Upload Documents
                </div>

                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-xs hover:bg-gray-50 cursor-pointer transition-colors">
                  <FontAwesomeIcon icon={faFileUpload} className="mb-2 block mx-auto text-lg text-gray-300" />
                  Upload Receipt
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-[#0A1229] hover:bg-[#1a2540] text-white py-2.5 rounded-lg font-medium transition-all shadow-lg">
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