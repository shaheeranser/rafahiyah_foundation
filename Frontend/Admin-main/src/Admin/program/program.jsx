import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEye,
  faTrash,
  faPen,
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
const MOCK_EVENTS = [
  { id: 101, title: 'Charity Gala Dinner', date: '2025-12-25' },
  { id: 102, title: 'Community Cleanup', date: '2026-01-10' },
  { id: 103, title: 'Winter Clothing Drive', date: '2024-11-15' },
  { id: 104, title: 'Health Awareness Camp', date: '2026-02-20' },
];

const MOCK_CASES = [
  { id: 201, title: 'Urgent Surgery for Child', caseNo: '1001' },
  { id: 202, title: 'University Fees Support', caseNo: '1002' },
  { id: 203, title: 'Widow Support Fund', caseNo: '1003' },
  { id: 204, title: 'Emergency Ration Pack', caseNo: '1004' },
];

// --- Components ---

// 1. Program Card
const ProgramCard = ({ program, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100 relative">
      <div className="relative h-56 overflow-hidden">
        <img
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          src={program.image}
          alt={program.name}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
          <h3 className="text-white font-bold text-2xl leading-tight mb-1 shadow-sm">{program.name}</h3>
          <p className="text-white/90 text-sm font-medium flex items-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-400" />
            {program.venue || 'Multiple Locations'}
          </p>
        </div>
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg text-xs font-bold text-gray-800 flex flex-col items-center min-w-[60px]">
          <span className="text-red-500 uppercase tracking-wider text-[10px]">Start</span>
          <span className="text-lg">{new Date(program.startDate).getDate()}</span>
          <span className="text-gray-500 uppercase">{new Date(program.startDate).toLocaleString('default', { month: 'short' })}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="w-4 mr-2 text-blue-500" />
            <span className="font-medium">
              {new Date(program.startDate).toLocaleDateString('en-GB')} - {program.endDate ? new Date(program.endDate).toLocaleDateString('en-GB') : 'Ongoing'}
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-6 text-sm line-clamp-3 leading-relaxed flex-grow">
          {program.description || 'No description available for this program.'}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-purple-50 rounded-lg p-2.5 flex items-center justify-center gap-2 border border-purple-100">
            <FontAwesomeIcon icon={faCalendarCheck} className="text-purple-500" />
            <span className="text-xs font-bold text-purple-700">{program.linkedEvents?.length || 0} Events</span>
          </div>
          <div className="bg-orange-50 rounded-lg p-2.5 flex items-center justify-center gap-2 border border-orange-100">
            <FontAwesomeIcon icon={faLayerGroup} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-700">{program.linkedCases?.length || 0} Cases</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
          <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${program.status === 'active'
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}>
            <span className={`w-2 h-2 rounded-full ${program.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            {program.status ? program.status.toUpperCase() : 'INACTIVE'}
          </span>

          <div className="flex gap-2">
            <button onClick={() => onView(program)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors shadow-sm" title="View Details">
              <FontAwesomeIcon icon={faEye} size="sm" />
            </button>
            <button onClick={() => onEdit(program)} className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors shadow-sm" title="Edit Program">
              <FontAwesomeIcon icon={faPen} size="sm" />
            </button>
            <button onClick={() => onDelete(program.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors shadow-sm" title="Delete Program">
              <FontAwesomeIcon icon={faTrash} size="sm" />
            </button>
          </div>
        </div>
      </div>
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
            status: 'active', // Default status as backend might not have it yet or it's different
            image: p.image ? `${API_BASE_URL.replace('/api', '')}/uploads/${p.image}` : 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop',
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
      selectedEventIds: program.linkedEvents || [],
      selectedCaseIds: program.linkedCases || []
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
            status: 'active',
            image: p.image ? `${API_BASE_URL.replace('/api', '')}/uploads/${p.image}` : 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop',
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
          status: 'active',
          image: p.image ? `${API_BASE_URL.replace('/api', '')}/uploads/${p.image}` : 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop',
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


  const filteredPrograms = programsData.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="text-gray-300 text-6xl mb-4"><FontAwesomeIcon icon={faBookOpen} /></div>
            <h3 className="text-lg font-bold text-gray-600">No Programs Found</h3>
            <p className="text-gray-400 text-sm mt-1">Try a different search term or create a new program.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map(program => (
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
              <button onClick={() => setShowViewModal(false)} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-all">
                <FontAwesomeIcon icon={faTimes} />
              </button>
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
                  <div className="text-2xl font-bold text-purple-900">{selectedProgram.linkedEvents?.length || 0}</div>
                </div>
                <div className="border border-orange-100 bg-orange-50 rounded-xl p-3">
                  <h4 className="text-xs font-bold text-orange-500 uppercase mb-2">Linked Cases</h4>
                  <div className="text-2xl font-bold text-orange-900">{selectedProgram.linkedCases?.length || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default Programs;