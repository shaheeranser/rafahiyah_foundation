import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTrash,
  faTimes,
  faDownload,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faBriefcase,
  faBirthdayCake,
  faUsers,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';
import Domain from '../../Api/Api';

const ViewVolunteerModal = ({ showModal, setShowModal, member }) => {
  if (!showModal || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Volunteer Details</h2>
          <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-3xl uppercase mb-3 shadow-md">
            {member.fullName?.charAt(0) || 'U'}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{member.fullName}</h3>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mt-1">
            {member.team || 'Volunteer'}
          </span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FontAwesomeIcon icon={faBirthdayCake} className="text-gray-400 w-5 mr-3" />
              <div>
                <p className="text-xs text-[#8B2D1B] uppercase font-bold">Age</p>
                <p className="text-gray-700">{member.age}</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FontAwesomeIcon icon={faBriefcase} className="text-gray-400 w-5 mr-3" />
              <div>
                <p className="text-xs text-[#8B2D1B] uppercase font-bold">Occupation</p>
                <p className="text-gray-700">{member.occupation}</p>
              </div>
            </div>
          </div>

          {/* Email removed as it's not in the backend data */}

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-5 mr-3" />
            <div>
              <p className="text-xs text-[#8B2D1B] uppercase font-bold">Phone</p>
              <p className="text-gray-700">{member.contactNumber}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 w-5 mr-3" />
            <div>
              <p className="text-xs text-[#8B2D1B] uppercase font-bold">City/Location</p>
              <p className="text-gray-700">{member.city || 'N/A'}</p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-[#8B2D1B] uppercase font-bold mb-1">Event / Additional Info</p>
            <p className="text-gray-600 text-sm">
              {member.eventName ? `Joined for event: ${member.eventName}` : 'No specific event mentioned.'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TeamData = ({ teamData, setTeamData }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Delete Volunteer
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${Domain()}/volunteers/${id}`);
          if (response.data.success) {
            setTeamData(teamData.filter(m => m._id !== id));
            Swal.fire('Deleted!', 'Volunteer has been removed.', 'success');
          }
        } catch (error) {
          Swal.fire('Error', 'Failed to delete volunteer', 'error');
          console.error(error);
        }
      }
    });
  };

  const handleView = (member) => {
    setSelectedMember(member);
    setShowViewModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-white">
                <th className="text-left py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Full Name</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Contact Number</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Age</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">City</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Occupation</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Team</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-[#8B2D1B] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(!teamData || teamData.length === 0) ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No volunteers found.
                  </td>
                </tr>
              ) : (
                teamData.map((member, index) => (
                  <tr key={member._id || index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    {/* Full Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                          {member.fullName?.charAt(0) || 'U'}
                        </div>
                        <div className="font-bold text-gray-800 text-sm">{member.fullName}</div>
                      </div>
                    </td>

                    {/* Contact Number */}
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {member.contactNumber}
                    </td>

                    {/* Age */}
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {member.age || '-'}
                    </td>

                    {/* City */}
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {member.city || '-'}
                    </td>

                    {/* Occupation */}
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faBriefcase} className="text-gray-300 text-xs" />
                        {member.occupation || '-'}
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-4 px-6">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100">
                        {member.team || 'General'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleView(member)}
                        className="text-blue-500 hover:text-blue-700 mx-2 transition-colors"
                        title="View Details"
                      >
                        <FontAwesomeIcon icon={faEye} size="sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-red-400 hover:text-red-600 ml-3 transition-colors"
                        title="Delete Volunteer"
                      >
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ViewVolunteerModal
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        member={selectedMember}
      />
    </>
  );
};

const Team = () => {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    try {
      const response = await axios.get(`${Domain()}/volunteers`);
      if (response.data.success) {
        setTeamData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      Swal.fire('Error', 'Failed to fetch volunteers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleExportCSV = () => {
    const headers = ['Full Name', 'Contact Number', 'Age', 'City', 'Occupation', 'Team', 'Joined On'];
    const rows = teamData.map(m => [
      `"${m.fullName}"`,
      `"${m.contactNumber}"`,
      `"${m.age || ''}"`,
      `"${m.city || ''}"`,
      `"${m.occupation || ''}"`,
      `"${m.team || ''}"`,
      `"${new Date(m.createdAt).toLocaleDateString()}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "volunteers_list.csv");
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
            <h1 className="text-3xl font-handwriting text-gray-800" style={{ fontFamily: '"Patrick Hand", cursive' }}>Volunteers</h1>
          </div>

          <button
            onClick={handleExportCSV}
            className="group bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all shadow-sm transform hover:-translate-y-0.5"
          >
            <span className="mr-2">Export</span>
            <FontAwesomeIcon icon={faDownload} className="text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Volunteers Table */}
        <TeamData teamData={teamData} setTeamData={setTeamData} />

      </div>
    </AdminLayout>
  );
};

export default Team;