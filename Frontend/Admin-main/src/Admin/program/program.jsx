import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEye,
  faTrash,
  faEdit,
  faTimes,
  faCalendarAlt,
  faMapMarkerAlt,
  faClock,
  faUsers,
  faBookOpen,
  faCheckCircle,
  faLayerGroup,
  faCalendarCheck,
  faCloudUploadAlt
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";

// --- Mock Data Providers ---


// --- Components ---

// 1. Program Card
const ProgramCard = ({ program, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative animate-fade-in-up">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={program.image}
          alt={program.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop'; }}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm">
          {new Date(program.startDate).toLocaleDateString('en-GB')}
        </div>

        <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm ${program.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {program.status || 'Active'}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg truncate pr-2">{program.name}</h3>
        </div>

        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-4 mr-2 text-indigo-400" />
            {new Date(program.startDate).toLocaleDateString('en-GB')} - {program.endDate ? new Date(program.endDate).toLocaleDateString('en-GB') : 'Ongoing'}
          </div>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 mr-2 text-pink-500" />
          <span className="truncate" title={program.venue}>{program.venue || 'Multiple Locations'}</span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="bg-purple-50 rounded-lg p-2 flex items-center justify-center gap-2 border border-purple-100">
            <FontAwesomeIcon icon={faCalendarCheck} className="text-purple-500 text-xs" />
            <span className="text-xs font-bold text-purple-700">{program.linkedEvents?.length || 0} Events</span>
          </div>
          <div className="bg-orange-50 rounded-lg p-2 flex items-center justify-center gap-2 border border-orange-100">
            <FontAwesomeIcon icon={faLayerGroup} className="text-orange-500 text-xs" />
            <span className="text-xs font-bold text-orange-700">{program.linkedCases?.length || 0} Cases</span>
          </div>
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={() => onView(program)}
          className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded"
          title="View Details"
        >
          <FontAwesomeIcon icon={faEye} />
          <span>View</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(program)}
            className="text-gray-400 hover:text-green-600 transition-colors p-2 hover:bg-green-50 rounded-full"
            title="Edit Program"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => onDelete(program.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
            title="Delete Program"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};



const CompletedProgramsTable = ({ programs, onView, onUndo }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
              <th className="p-4">Program Name</th>
              <th className="p-4">Venue</th>
              <th className="p-4">Date Range</th>
              <th className="p-4">Linked Items</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {programs.map((program) => (
              <tr key={program.id} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4 font-medium text-gray-800">{program.name}</td>
                <td className="p-4 text-gray-600">{program.venue}</td>
                <td className="p-4 text-gray-500">
                  {new Date(program.startDate).toLocaleDateString()} - {program.endDate ? new Date(program.endDate).toLocaleDateString() : 'Ongoing'}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-bold border border-purple-100">{program.linkedEvents.length} Events</span>
                    <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-xs font-bold border border-orange-100">{program.linkedCases.length} Cases</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onView(program)} className="text-gray-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-colors" title="View Details">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button onClick={() => onUndo(program)} className="text-gray-400 hover:text-green-600 p-1.5 rounded-full hover:bg-green-50 transition-colors" title="Undo Completion">
                      <FontAwesomeIcon icon={faCalendarCheck} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {programs.length === 0 && (
        <div className="p-8 text-center text-gray-400 italic">No completed programs yet.</div>
      )}
    </div>
  );
};

const Programs = () => {
  // State
  const [programsData, setProgramsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Forms
  const [programForm, setProgramForm] = useState({
    name: '',
    description: '',
    venue: '',
    startDate: '',
    endDate: '',
    status: 'active',
    image: null,
    selectedEventIds: [], // Array of IDs
    selectedCaseIds: []   // Array of IDs
  });

  const [eventsList, setEventsList] = useState([]);
  const [casesList, setCasesList] = useState([]);

  // Fetch Data
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        console.log("Fetching programs from:", `${API_BASE_URL}/programs/getallprogram`);

        const response = await axios.get(`${API_BASE_URL}/programs/getallprogram`);
        console.log("Fetch response:", response);

        if (response.data.success) {
          const mappedPrograms = response.data.programs.map(p => ({
            id: p._id,
            name: p.title,
            description: p.description,
            venue: p.venue,
            startDate: p.startingDate,
            endDate: p.endingDate,
            status: p.status || 'active',
            image: p.image ? `${API_BASE_URL.replace('/api', '')}/uploads/images/${p.image}` : 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop',
            linkedEvents: p.linkedEvents || [],
            linkedCases: p.linkedCases || []
          }));
          setProgramsData(mappedPrograms);
        } else {
          console.error("Fetch success false:", response.data);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        if (error.response && error.response.status === 401) {
          Swal.fire('Session Expired', 'Your session has expired. Please log out and log in again.', 'warning');
        } else {
          console.error(error);
        }
      }
    };

    const fetchEventsAndCases = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
        const [eventsRes, casesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/events/getallevent`),
          axios.get(`${API_BASE_URL}/cases`)
        ]);

        if (eventsRes.data.success) {
          setEventsList(eventsRes.data.events || []);
        }
        // Cases API returns array directly or { success: true, data: [...] } ?
        // Based on caseRoutes.js: router.get('/', getCases);
        // Standard practice checking:
        if (Array.isArray(casesRes.data)) {
          setCasesList(casesRes.data);
        } else if (casesRes.data.success && casesRes.data.cases) {
          setCasesList(casesRes.data.cases);
        } else if (casesRes.data.success && casesRes.data.data) { // common pattern
          setCasesList(casesRes.data.data);
        }

      } catch (error) {
        console.error("Error fetching events/cases:", error);
      }
    };

    fetchPrograms();
    fetchEventsAndCases();
  }, []);

  // Handlers
  const handleSearch = (e) => setSearchQuery(e.target.value);

  const resetForm = () => {
    setProgramForm({
      name: '',
      description: '',
      venue: '',
      startDate: '',
      endDate: '',
      status: 'active',
      image: null,
      selectedEventIds: [],
      selectedCaseIds: []
    });
  };

  const handleCreateOpen = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEditOpen = (program) => {
    setSelectedProgram(program);
    setProgramForm({
      name: program.name,
      description: program.description,
      venue: program.venue,
      startDate: program.startDate,
      endDate: program.endDate || '',
      status: program.status,
      image: program.image,
      selectedEventIds: (program.linkedEvents || []).map(e => typeof e === 'object' ? e._id : e),
      selectedCaseIds: (program.linkedCases || []).map(c => typeof c === 'object' ? c._id : c)
    });
    setShowEditModal(true);
  };

  const handleViewOpen = (program) => {
    setSelectedProgram(program);
    setShowViewModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('authToken');
          const config = {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          };
          const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
          await axios.delete(`${API_BASE_URL}/programs/delete/${id}`, config);

          setProgramsData(prev => prev.filter(p => p.id !== id));
          Swal.fire('Deleted!', 'Program has been deleted.', 'success');
        } catch (error) {
          console.error("Error deleting program:", error);
          if (error.response && error.response.status === 401) {
            Swal.fire('Session Expired', 'Your session has expired. Please log out and log in again.', 'warning');
          } else {
            Swal.fire('Error', 'Failed to delete program', 'error');
          }
        }
      }
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        Swal.fire('Error', 'Not authenticated', 'error');
        return;
      }

      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      const formData = new FormData();
      formData.append('title', programForm.name);
      formData.append('venue', programForm.venue);
      formData.append('description', programForm.description);
      formData.append('startingDate', programForm.startDate);
      formData.append('endingDate', programForm.endDate);
      if (programForm.imageFile) {
        formData.append('image', programForm.imageFile);
      }
      formData.append('linkedEvents', JSON.stringify(programForm.selectedEventIds));
      formData.append('linkedCases', JSON.stringify(programForm.selectedCaseIds));

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.post(`${API_BASE_URL}/programs/create/program`, formData, config);

      if (response.data.success || response.data._id) { // Check for success or if ID is returned
        Swal.fire('Success', 'Program created successfully', 'success');

        // Refresh list
        const fetchResponse = await axios.get(`${API_BASE_URL}/programs/getallprogram`);
        if (fetchResponse.data.success) {
          const mappedPrograms = fetchResponse.data.programs.map(p => ({
            id: p._id,
            name: p.title,
            description: p.description,
            venue: p.venue,
            startDate: p.startingDate,
            endDate: p.endingDate,

            status: p.status || 'active',
            image: p.image ? `${API_BASE_URL.replace('/api', '')}/uploads/images/${p.image}` : 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop',
            linkedEvents: p.linkedEvents || [],
            linkedCases: p.linkedCases || []
          }));
          setProgramsData(mappedPrograms);
        }
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error("Error creating program:", error);
      if (error.response && error.response.status === 401) {
        Swal.fire('Session Expired', 'Your session has expired. Please log out and log in again.', 'warning');
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Failed to create program', 'error');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        Swal.fire('Error', 'Not authenticated', 'error');
        return;
      }

      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      const formData = new FormData();
      formData.append('title', programForm.name);
      formData.append('venue', programForm.venue);
      formData.append('description', programForm.description);
      formData.append('startingDate', programForm.startDate);
      formData.append('endingDate', programForm.endDate);
      formData.append('status', programForm.status);
      if (programForm.imageFile) {
        formData.append('image', programForm.imageFile);
      }
      formData.append('linkedEvents', JSON.stringify(programForm.selectedEventIds));
      formData.append('linkedCases', JSON.stringify(programForm.selectedCaseIds));

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      await axios.put(`${API_BASE_URL}/programs/update/${selectedProgram.id}`, formData, config);

      Swal.fire('Updated', 'Program updated successfully', 'success');
      // Refresh list
      const fetchResponse = await axios.get(`${API_BASE_URL}/programs/getallprogram`);
      if (fetchResponse.data.success) {
        const mappedPrograms = fetchResponse.data.programs.map(p => ({
          id: p._id,
          name: p.title,
          description: p.description,
          venue: p.venue,
          startDate: p.startingDate,
          endDate: p.endingDate,
          status: p.status || 'active',
          image: p.image ? `${API_BASE_URL.replace('/api', '')}/uploads/images/${p.image}` : 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop',
          linkedEvents: p.linkedEvents || [],
          linkedCases: p.linkedCases || []
        }));
        setProgramsData(mappedPrograms);
      }
      setShowEditModal(false);

    } catch (error) {
      console.error("Error updating program:", error);
      if (error.response && error.response.status === 401) {
        Swal.fire('Session Expired', 'Your session has expired. Please log out and log in again.', 'warning');
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Failed to update program', 'error');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProgramForm(prev => ({ ...prev, image: imageUrl, imageFile: file }));
    }
  };

  const toggleSelection = (id, field) => {
    setProgramForm(prev => {
      const list = prev[field];
      if (list.includes(id)) {
        return { ...prev, [field]: list.filter(item => item !== id) };
      } else {
        return { ...prev, [field]: [...list, id] };
      }
    });
  };


  // Helper to construct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    const baseUrl = API_BASE_URL.replace('/api', '');

    // Normalize path separators
    const normalizedPath = imagePath.replace(/\\/g, '/');

    // If it already includes 'uploads/', assume it's the full relative path
    if (normalizedPath.startsWith('uploads/')) {
      return `${baseUrl}/${normalizedPath}`;
    }
    // Otherwise assume it's just the filename in uploads/images
    return `${baseUrl}/uploads/images/${normalizedPath}`;
  };

  const handleViewEventDetails = (event) => {
    if (!event) return;

    const imageUrl = getImageUrl(event.image);

    // Formatting currency
    const formatCurrency = (amount) => {
      return amount ? `PKR ${amount.toLocaleString()}` : 'PKR 0';
    };

    const statusBadge = event.status === 'Completed'
      ? '<span class="px-2 py-1 text-xs font-bold text-green-700 bg-green-100 rounded-full">Completed</span>'
      : '<span class="px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-100 rounded-full">Incomplete</span>';

    Swal.fire({
      title: `<h3 class="text-xl font-bold text-gray-800">${event.title}</h3>`,
      html: `
        <div class="text-left space-y-3 mt-4">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div><span class="font-bold text-gray-600 block">Date</span> ${event.date ? new Date(event.date).toLocaleDateString() : (event.startingDate ? new Date(event.startingDate).toLocaleDateString() : 'N/A')}</div>
            <div><span class="font-bold text-gray-600 block">Time</span> ${event.time || 'N/A'}</div>
            <div><span class="font-bold text-gray-600 block">Location</span> ${event.location || event.venue || 'N/A'}</div>
            <div><span class="font-bold text-gray-600 block">Status</span> ${statusBadge}</div>
            <div><span class="font-bold text-gray-600 block">Required</span> ${formatCurrency(event.requiredAmount)}</div>
            <div><span class="font-bold text-gray-600 block">Collected</span> ${formatCurrency(event.collectedAmount)}</div>
          </div>
          
          <div class="pt-2 border-t border-gray-100">
             <p class="text-xs text-gray-500 mb-1 font-bold uppercase">Description</p>
             <div class="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 border border-gray-100 max-h-40 overflow-y-auto">
               ${event.description || 'No description available.'}
             </div>
          </div>
        </div>
      `,
      imageUrl: imageUrl,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: event.title,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-xl',
        image: 'rounded-lg object-cover mb-4'
      }
    });
  };

  const handleViewCaseDetails = (caseItem) => {
    if (!caseItem) return;

    const imageUrl = getImageUrl(caseItem.image);

    const formatCurrency = (amount) => {
      return amount ? `PKR ${amount.toLocaleString()}` : 'PKR 0';
    };

    const statusColors = {
      active: 'text-green-700 bg-green-100',
      completed: 'text-blue-700 bg-blue-100',
      dropped: 'text-red-700 bg-red-100'
    };
    const statusClass = statusColors[caseItem.status] || 'text-gray-700 bg-gray-100';
    const statusBadge = `<span class="px-2 py-1 text-xs font-bold rounded-full ${statusClass}">${caseItem.status ? caseItem.status.toUpperCase() : 'UNKNOWN'}</span>`;

    Swal.fire({
      title: `<h3 class="text-xl font-bold text-gray-800">${caseItem.title}</h3>`,
      html: `
        <div class="text-left space-y-3 mt-4">
          <div class="flex justify-between items-center bg-gray-50 p-2 rounded mb-2">
            <span class="text-xs font-bold text-gray-500">CASE NO: ${caseItem.caseNo || 'N/A'}</span>
            ${statusBadge}
          </div>

          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="col-span-2"><span class="font-bold text-gray-600 block">Category</span> ${caseItem.category || 'General'}</div>
            <div><span class="font-bold text-gray-600 block">Required</span> ${formatCurrency(caseItem.amountRequired)}</div>
            <div><span class="font-bold text-gray-600 block">Collected</span> ${formatCurrency(caseItem.amountCollected)}</div>
            ${caseItem.finalAmount ? `<div><span class="font-bold text-gray-600 block">Final Amount</span> ${formatCurrency(caseItem.finalAmount)}</div>` : ''}
          </div>
           
          <div class="pt-2 border-t border-gray-100">
             <p class="text-xs text-gray-500 mb-1 font-bold uppercase">Description</p>
             <div class="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 border border-gray-100 max-h-40 overflow-y-auto">
              ${caseItem.description || 'No description available.'}
            </div>
          </div>
        </div>
      `,
      imageUrl: imageUrl,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: caseItem.title,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-xl',
        image: 'rounded-lg object-cover mb-4'
      }
    });
  };



  const handleMarkComplete = async (program) => {
    // 1. Validation: Check linked Events
    const incompleteEvents = program.linkedEvents.filter(eventId => {
      const id = typeof eventId === 'object' ? eventId._id : eventId;
      const event = eventsList.find(e => e._id === id);
      return event && event.status !== 'Completed';
    });

    if (incompleteEvents.length > 0) {
      Swal.fire('Cannot Complete', `There are ${incompleteEvents.length} incomplete events linked to this program. Please complete them first.`, 'warning');
      return;
    }

    // 2. Validation: Check linked Cases
    const incompleteCases = program.linkedCases.filter(caseId => {
      const id = typeof caseId === 'object' ? caseId._id : caseId;
      const caseItem = casesList.find(c => c._id === id);
      return caseItem && caseItem.status !== 'completed';
    });

    if (incompleteCases.length > 0) {
      Swal.fire('Cannot Complete', `There are ${incompleteCases.length} incomplete cases linked to this program. Please complete them first.`, 'warning');
      return;
    }

    // 3. Proceed to update status
    try {
      const token = localStorage.getItem('authToken');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      const formData = new FormData();
      formData.append('status', 'completed');

      // We are using the generic update endpoint which uses FormData
      // Ideally we would have a specific PATCH endpoint, but using existing Update logic
      // Note: We need to send other required fields if backend requires them on PUT, 
      // but if it's a PATCH or flexible PUT, just status might work. 
      // Since existing handleEditSubmit uses PUT with all fields, let's try to construct a minimal valid request 
      // OR better, create a specific status update flow if backend supports it. 
      // Assuming we need to send at least required structure.
      // Let's try sending just status as JSON if backend supports it, otherwise we'd need to re-send all data.
      // Given the `update` route in `programRoute.js` likely maps to `updateProgram` in controller which handles file upload...
      // Let's assume for now we can't easily do a partial update without potentially clearing other fields if the controller expects them.
      // SAFEST APPROACH: Use the existing data and just change status.

      // Re-constructing FormData with existing data + new status
      const data = new FormData();
      data.append('title', program.name);
      data.append('venue', program.venue);
      data.append('description', program.description);
      data.append('startingDate', program.startDate);
      // Fallback to startDate if endDate is missing to verify backend validation
      data.append('endingDate', program.endDate || program.startDate);
      // image is tricky if it's already there. Usually we don't send it back if we don't change it.
      data.append('status', 'completed');
      // CAUTION: program.linkedEvents/linkedCases are populated objects not IDs. Map them to IDs.
      const linkedEventIds = program.linkedEvents.map(e => typeof e === 'object' ? e._id : e);
      const linkedCaseIds = program.linkedCases.map(c => typeof c === 'object' ? c._id : c);

      data.append('linkedEvents', JSON.stringify(linkedEventIds));
      data.append('linkedCases', JSON.stringify(linkedCaseIds));

      await axios.put(`${API_BASE_URL}/programs/update/${program.id}`, data, config);

      Swal.fire('Success', 'Program marked as completed!', 'success');

      // Update local state
      setProgramsData(prev => prev.map(p => p.id === program.id ? { ...p, status: 'completed' } : p));
      setShowViewModal(false);

    } catch (error) {
      console.error("Error completing program:", error);
      Swal.fire('Error', 'Failed to mark program as completed', 'error');
    }
  };

  const handleUndoComplete = async (program) => {
    try {
      const token = localStorage.getItem('authToken');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      const data = new FormData();
      data.append('title', program.name);
      data.append('venue', program.venue);
      data.append('description', program.description);
      data.append('startingDate', program.startDate);
      data.append('endingDate', program.endDate || program.startDate);
      data.append('status', 'active');
      // Map to IDs
      const linkedEventIds = program.linkedEvents.map(e => typeof e === 'object' ? e._id : e);
      const linkedCaseIds = program.linkedCases.map(c => typeof c === 'object' ? c._id : c);

      data.append('linkedEvents', JSON.stringify(linkedEventIds));
      data.append('linkedCases', JSON.stringify(linkedCaseIds));

      await axios.put(`${API_BASE_URL}/programs/update/${program.id}`, data, config);

      Swal.fire('Restored', 'Program restored to active list', 'success');

      // Update local state
      setProgramsData(prev => prev.map(p => p.id === program.id ? { ...p, status: 'active' } : p));

    } catch (error) {
      console.error("Error restoring program:", error);
      Swal.fire('Error', 'Failed to restore program', 'error');
    }
  };


  const filteredPrograms = programsData.filter(p =>
  (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.venue.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activePrograms = filteredPrograms.filter(p => p.status !== 'completed');
  const completedPrograms = filteredPrograms.filter(p => p.status === 'completed');

  return (
    <AdminLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-handwriting text-gray-800" style={{ fontFamily: '"Patrick Hand", cursive' }}>Program Management</h1>
            <p className="text-gray-500 text-sm mt-1">Manage comprehensive programs, associated events, and cases.</p>
          </div>
          <button
            onClick={handleCreateOpen}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg shadow-gray-200"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Program
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex gap-4">
          <div className="relative flex-grow">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs by name or venue..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Grid */}
        {/* Grid - Active Programs */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 font-handwriting">Active Programs</h2>
          {activePrograms.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="text-gray-300 text-6xl mb-4"><FontAwesomeIcon icon={faBookOpen} /></div>
              <h3 className="text-lg font-bold text-gray-600">No Active Programs Found</h3>
              <p className="text-gray-400 text-sm mt-1">Try a different search term or create a new program.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activePrograms.map(program => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onView={handleViewOpen}
                  onEdit={handleEditOpen}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Table - Completed Programs */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 font-handwriting">Completed Programs</h2>
          <CompletedProgramsTable
            programs={completedPrograms}
            onView={handleViewOpen}
            onUndo={handleUndoComplete}
          />
        </div>

      </div>

      {/* --- MODALS --- */}

      {/* 1. Create/Edit Logic reused via state content */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up my-4">
            <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {showCreateModal ? 'Create New Program' : 'Edit Program'}
              </h3>
              <button onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            <form onSubmit={showCreateModal ? handleCreateSubmit : handleEditSubmit} className="p-8 space-y-6">
              {/* Name & Venue */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Program Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Winter Relief" value={programForm.name} onChange={e => setProgramForm({ ...programForm, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Venue</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. City Hall / Multiple" value={programForm.venue} onChange={e => setProgramForm({ ...programForm, venue: e.target.value })} required />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Program Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center group hover:border-blue-500 transition-colors">
                    {programForm.image ? (
                      <img src={programForm.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FontAwesomeIcon icon={faCloudUploadAlt} className="text-gray-400 text-xl group-hover:text-blue-500" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Upload a cover image</p>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Description</label>
                <textarea rows="3" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Detailed description of the program..." value={programForm.description} onChange={e => setProgramForm({ ...programForm, description: e.target.value })} required></textarea>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div>
                  <label className="block text-xs font-bold text-blue-700 uppercase mb-1.5">Start Date</label>
                  <input type="date" className="w-full border border-blue-200 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={programForm.startDate} onChange={e => setProgramForm({ ...programForm, startDate: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-blue-700 uppercase mb-1.5">End Date</label>
                  <input type="date" className="w-full border border-blue-200 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={programForm.endDate} onChange={e => setProgramForm({ ...programForm, endDate: e.target.value })} />
                </div>
              </div>

              {/* Linked Items Selection */}
              <div className="grid grid-cols-2 gap-6">
                {/* Events Selection */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <label className="block text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarCheck} /> Link Events
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {eventsList.map(ev => (
                      <div key={ev._id}
                        onClick={() => toggleSelection(ev._id, 'selectedEventIds')}
                        className={`p-2 rounded-lg text-xs cursor-pointer border transition-all flex justify-between items-center ${programForm.selectedEventIds.includes(ev._id) ? 'bg-purple-100 border-purple-300 text-purple-900' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
                      >
                        <div className="font-medium truncate pr-2">{ev.title}</div>
                        {programForm.selectedEventIds.includes(ev._id) && <FontAwesomeIcon icon={faCheckCircle} />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cases Selection */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <label className="block text-xs font-bold text-orange-600 uppercase mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} /> Link Cases
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {casesList.map(c => (
                      <div key={c._id}
                        onClick={() => toggleSelection(c._id, 'selectedCaseIds')}
                        className={`p-2 rounded-lg text-xs cursor-pointer border transition-all flex justify-between items-center ${programForm.selectedCaseIds.includes(c._id) ? 'bg-orange-100 border-orange-300 text-orange-900' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
                      >
                        <div className="font-medium truncate pr-2">{c.title}</div>
                        {programForm.selectedCaseIds.includes(c._id) && <FontAwesomeIcon icon={faCheckCircle} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-gray-300">
                  {showCreateModal ? 'Detailed Program Creation' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="relative h-48">
              <img src={selectedProgram.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-4 right-4 flex gap-2">

                <button onClick={() => setShowViewModal(false)} className="bg-black/50 hover:bg-black/70 text-white w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-all">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProgram.name}</h2>
              <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500" /> {selectedProgram.venue}
                <span className="mx-2">|</span>
                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" /> {new Date(selectedProgram.startDate).toLocaleDateString()}
              </p>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {selectedProgram.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border border-purple-100 bg-purple-50 rounded-xl p-3">
                  <h4 className="text-xs font-bold text-purple-500 uppercase mb-2">Linked Events</h4>
                  {selectedProgram.linkedEvents && selectedProgram.linkedEvents.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                      {selectedProgram.linkedEvents.map(eventId => {
                        // Handle if eventId is an object (populated) or string (ID)
                        const id = typeof eventId === 'object' ? eventId._id : eventId;
                        const event = eventsList.find(e => e._id === id);
                        return (
                          <div key={id} className="bg-white/60 p-1.5 rounded text-sm text-purple-900 border border-purple-100 flex items-center justify-between gap-2 group hover:bg-white transition-all">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FontAwesomeIcon icon={faCalendarCheck} className="text-purple-400 text-xs flex-shrink-0" />
                              <span className="truncate">{event ? event.title : (typeof eventId === 'object' ? eventId.title : 'Unknown Event')}</span>
                            </div>
                            <button
                              onClick={() => handleViewEventDetails(event || (typeof eventId === 'object' ? eventId : null))}
                              className="text-purple-300 hover:text-purple-600 p-1 rounded-full hover:bg-purple-50 transition-colors opacity-0 group-hover:opacity-100"
                              title="View Event Details"
                            >
                              <FontAwesomeIcon icon={faEye} className="text-xs" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-purple-400 italic">No linked events</div>
                  )}
                </div>
                <div className="border border-orange-100 bg-orange-50 rounded-xl p-3">
                  <h4 className="text-xs font-bold text-orange-500 uppercase mb-2">Linked Cases</h4>
                  {selectedProgram.linkedCases && selectedProgram.linkedCases.length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                      {selectedProgram.linkedCases.map(caseId => {
                        const id = typeof caseId === 'object' ? caseId._id : caseId;
                        const caseItem = casesList.find(c => c._id === id);
                        return (
                          <div key={id} className="bg-white/60 p-1.5 rounded text-sm text-orange-900 border border-orange-100 flex items-center justify-between gap-2 group hover:bg-white transition-all">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FontAwesomeIcon icon={faLayerGroup} className="text-orange-400 text-xs flex-shrink-0" />
                              <span className="truncate">{caseItem ? caseItem.title : (typeof caseId === 'object' ? caseId.title : 'Unknown Case')}</span>
                            </div>
                            <button
                              onClick={() => handleViewCaseDetails(caseItem || (typeof caseId === 'object' ? caseId : null))}
                              className="text-orange-300 hover:text-orange-600 p-1 rounded-full hover:bg-orange-50 transition-colors opacity-0 group-hover:opacity-100"
                              title="View Case Details"
                            >
                              <FontAwesomeIcon icon={faEye} className="text-xs" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-orange-400 italic">No linked cases</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => { setShowViewModal(false); handleEditOpen(selectedProgram); }}
                  className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit Program
                </button>

                {selectedProgram.status !== 'completed' ? (
                  <button
                    onClick={() => handleMarkComplete(selectedProgram)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} /> Mark as Complete
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-gray-100 text-green-700 py-2.5 rounded-xl font-bold cursor-default flex items-center justify-center gap-2 border border-blue-100"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} /> Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default Programs;