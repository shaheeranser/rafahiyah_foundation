import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTrash,
  faSearch,
  faTimes,
  faSpinner,
  faUser,
  faEnvelope,
  faTag,
  faCalendarAlt,
  faDownload,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';
import Domain from '../../Api/Api';

const ContactData = ({ contactData, setContactData, currentPage, itemsPerPage }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const contactsToDisplay = contactData.slice(startIndex, endIndex);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (contactId) => {
    Swal.fire({
      icon: 'warning',
      title: 'Delete?',
      text: 'Are you sure you want to delete this message?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${Domain()}/contactus/delete/${contactId}`);
          if (response.data.success) {
            Swal.fire('Deleted!', 'Message has been deleted.', 'success');
            setContactData(prev => prev.filter(c => c._id !== contactId));
          }
        } catch (error) {
          console.error("Error deleting contact:", error);
          Swal.fire('Error', 'Failed to delete message', 'error');
        }
      }
    });
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-white">
                <th className="text-left py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Subject</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Contact Number</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Date</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!contactsToDisplay || contactsToDisplay.length === 0) ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No messages found.
                  </td>
                </tr>
              ) : (
                contactsToDisplay.map((contact, index) => (
                  <tr key={contact._id || index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-800 text-sm">{contact.fullName}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {contact.subject}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {contact.email}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {contact.contactNumber || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleView(contact)}
                        className="text-blue-500 hover:text-blue-700 mx-2 transition-colors"
                        title="View"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="text-red-400 hover:text-red-600 mx-2 transition-colors"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Detail Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Message Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-3 w-4" />
                    <div>
                      <p className="text-xs text-[#8B2D1B] uppercase font-bold">Sender</p>
                      <p className="text-gray-800 font-medium">{selectedContact.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-3 w-4" />
                    <div>
                      <p className="text-xs text-[#8B2D1B] uppercase font-bold">Email</p>
                      <p className="text-gray-800 font-medium">{selectedContact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faPhone} className="text-gray-400 mr-3 w-4" />
                    <div>
                      <p className="text-xs text-[#8B2D1B] uppercase font-bold">Contact Number</p>
                      <p className="text-gray-800 font-medium">{selectedContact.contactNumber || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faTag} className="text-gray-400 mr-3 w-4" />
                    <div>
                      <p className="text-xs text-[#8B2D1B] uppercase font-bold">Subject</p>
                      <p className="text-gray-800 font-medium">{selectedContact.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-3 w-4" />
                    <div>
                      <p className="text-xs text-[#8B2D1B] uppercase font-bold">Date Received</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(selectedContact.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-800 mb-2">Message Content</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm">{selectedContact.message}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Contact = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [contactData, setContactData] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${Domain()}/contactus/getallcontact`);
      if (response.data.success) {
        setContactData(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      Swal.fire('Error', 'Failed to fetch messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleExportCSV = () => {
    const headers = ['Full Name', 'Email', 'Contact Number', 'Subject', 'Date', 'Message'];
    const rows = contactData.map(c => [
      `"${c.fullName}"`,
      `"${c.email}"`,
      `"${c.contactNumber || ''}"`,
      `"${c.subject}"`,
      `"${new Date(c.createdAt).toLocaleDateString()}"`,
      `"${c.message.replace(/"/g, '""')}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contact_messages.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <AdminLayout>
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-handwriting text-gray-800" style={{ fontFamily: '"Patrick Hand", cursive' }}>Contact Us</h1>
          </div>

          <button
            onClick={handleExportCSV}
            className="group bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all shadow-sm transform hover:-translate-y-0.5"
          >
            <span className="mr-2">Export</span>
            <FontAwesomeIcon icon={faDownload} className="text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Contact Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-gray-400" />
          </div>
        ) : (
          <ContactData
            contactData={contactData}
            setContactData={setContactData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Contact;