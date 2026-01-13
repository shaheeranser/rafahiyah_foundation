import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { AuthToken } from '../../Api/Api';

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

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [unapprovedDonations, setUnapprovedDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unapproved'
  const [loading, setLoading] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);


  // Fetch all donations
  const fetchAllDonations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/donations/all');
      setDonations(response.data);
    } catch (error) {
      console.error('Error fetching donations:', error);
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please login as admin.', 'error');
      } else {
        Swal.fire('Error', 'Failed to fetch donations', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch unapproved donations
  const fetchUnapprovedDonations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/donations/unapproved');
      setUnapprovedDonations(response.data);
    } catch (error) {
      console.error('Error fetching unapproved donations:', error);
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please login as admin.', 'error');
      } else {
        Swal.fire('Error', 'Failed to fetch unapproved donations', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Approve donation
  const approveDonation = async (donationId) => {

    try {
      const result = await Swal.fire({
        title: 'Approve Donation?',
        text: 'Are you sure you want to approve this donation?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, approve it!'
      });

      if (result.isConfirmed) {
        await api.put(`/donations/${donationId}/approve`);
        Swal.fire('Approved!', 'Donation has been approved.', 'success');
        // Refresh data
        fetchAllDonations();
        fetchUnapprovedDonations();
      }
    } catch (error) {
      console.error('Error approving donation:', error);
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please login as admin.', 'error');
      } else {
        Swal.fire('Error', 'Failed to approve donation', 'error');
      }
    }
  };

  // Reject donation
  const rejectDonation = async (donationId) => {

    try {
      const result = await Swal.fire({
        title: 'Reject Donation?',
        text: 'Are you sure you want to reject this donation?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, reject it!'
      });

      if (result.isConfirmed) {
        await api.put(`/donations/reject/${donationId}`);
        Swal.fire('Rejected!', 'Donation has been rejected.', 'success');
        // Refresh data
        fetchAllDonations();
        fetchUnapprovedDonations();
      }
    } catch (error) {
      console.error('Error rejecting donation:', error);
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please login as admin.', 'error');
      } else {
        Swal.fire('Error', 'Failed to reject donation', 'error');
      }
    }
  };

  // View donation details
  const viewDonationDetails = async (donationId) => {

    try {
      const response = await api.get(`/donations/${donationId}`);
      setSelectedDonation(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching donation details:', error);
      if (error.response?.status === 401) {
        Swal.fire('Error', 'Unauthorized access. Please login as admin.', 'error');
      } else {
        Swal.fire('Error', 'Failed to fetch donation details', 'error');
      }
    }
  };

  useEffect(() => {
    fetchAllDonations();
    fetchUnapprovedDonations();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusBadge = (donation) => {
    if (donation.status === 'Rejected' || donation.rejected) {
      return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Rejected</span>;
    } else if (donation.status === 'Verified' || donation.approved) {
      return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Approved</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
    }
  };

  const renderRow = (donation) => (
    <tr key={donation._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">{donation.user?.name || donation.fullName || 'Anonymous'}</div>
          <div className="text-sm text-gray-500">{donation.user?.email || donation.email}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-green-600">{formatAmount(donation.amount)}</div>
        <div className="text-xs text-gray-500 capitalize">{donation.paymentMethod}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatDate(donation.createdAt || donation.date)}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 font-medium">{donation.cause}</div>
        <div className="text-xs text-gray-500 capitalize">{donation.purpose}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(donation)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => viewDonationDetails(donation._id)}
            className="text-indigo-600 hover:text-indigo-900"
            title="View Details"
          >
            <Eye size={20} />
          </button>

          {!donation.approved && !donation.rejected && donation.status === 'Pending' && (
            <>
              <button
                onClick={() => approveDonation(donation._id)}
                className="text-green-600 hover:text-green-900"
                title="Approve"
              >
                <CheckCircle size={20} />
              </button>
              <button
                onClick={() => rejectDonation(donation._id)}
                className="text-red-600 hover:text-red-900"
                title="Reject"
              >
                <XCircle size={20} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const Modal = ({ donation, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Donation Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Donor</label>
              <p className="text-gray-900">{donation.user?.name || donation.fullName || 'Anonymous'}</p>
              <p className="text-gray-600 text-sm">{donation.user?.email || donation.email}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Amount</label>
              <p className="text-2xl font-bold text-green-600">{formatAmount(donation.amount)}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Date</label>
              <p className="text-gray-900">{formatDate(donation.createdAt || donation.date)}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Payment Method</label>
              <p className="text-gray-900 capitalize">{donation.paymentMethod}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Campaign</label>
              <p className="text-gray-900">{donation.cause} - {donation.purpose}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Status</label>
              {getStatusBadge(donation)}
            </div>

            {donation.receiptUrl && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">Receipt</label>
                <a
                  href={`http://localhost:8000/api/${donation.receiptUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline"
                >
                  View Receipt
                </a>
              </div>
            )}

            {donation.receipt && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">Receipt</label>
                <a
                  href={`http://localhost:8000/api/${donation.receipt}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline"
                >
                  View Receipt
                </a>
              </div>
            )}
          </div>

          {!donation.approved && !donation.rejected && donation.status === 'Pending' && (
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  approveDonation(donation._id);
                  onClose();
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  rejectDonation(donation._id);
                  onClose();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Donations Management</h1>
          <div className="flex space-x-4 text-sm">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Total: {donations.length}
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              Pending: {unapprovedDonations.length}
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Approved: {donations.filter(d => d.approved || d.status === 'Verified').length}
            </div>
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
              Rejected: {donations.filter(d => d.rejected || d.status === 'Rejected').length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'all'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                All Donations ({donations.length})
              </button>
              <button
                onClick={() => setActiveTab('unapproved')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'unapproved'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Pending Approval ({unapprovedDonations.length})
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg" style={{ minHeight: '400px', paddingBottom: '100px' }}>
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cause & Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeTab === 'all' ? (
                    donations.length > 0 ? (
                      donations.map((donation) => renderRow(donation))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No donations found
                        </td>
                      </tr>
                    )
                  ) : (
                    unapprovedDonations.length > 0 ? (
                      unapprovedDonations.map((donation) => renderRow(donation))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No pending donations
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedDonation && (
          <Modal
            donation={selectedDonation}
            onClose={() => {
              setShowModal(false);
              setSelectedDonation(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Donations;