import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faCalendarAlt,
  faMapMarkerAlt,
  faClock,
  faEye,
  faEdit,
  faTrash,
  faDownload,
  faTimes,
  faFileUpload,
  faCheckCircle,
  faEllipsisV,
  faUndo
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";
import Domain from "../../Api/Api";

// --- Components ---

// 1. Recent Event Card
const EventCard = ({ event, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={`http://localhost:8000/${event.image?.replace(/\\/g, '/')}`}
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => e.target.src = '/default-event.jpg'}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm">
          {new Date(event.date).toLocaleDateString('en-GB')}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg truncate pr-2">{event.title}</h3>
        </div>

        {/* Progress Bar if budget exists */}
        {(event.requiredAmount > 0) && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Raised: ${event.collectedAmount || 0}</span>
              <span>Goal: ${event.requiredAmount}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round(((event.collectedAmount || 0) / event.requiredAmount) * 100))}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="w-4 mr-2 text-indigo-400" />
            {event.time}
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 mr-2 text-pink-500" />
            <span className="truncate max-w-[100px]" title={event.location}>{event.location}</span>
          </div>
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={() => onView(event)}
          className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded"
          title="View Details"
        >
          <FontAwesomeIcon icon={faEye} />
          <span>View</span>
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className="text-gray-400 hover:text-green-600 transition-colors p-2 hover:bg-green-50 rounded-full"
            title="Edit Event"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
            title="Delete Event"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Completed Events Table
const CompletedTable = ({ events, onExport, onView, onUndo, onEdit }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!events || events.length === 0) {
    return <div className="p-12 text-center text-gray-400 border border-dashed rounded-xl bg-gray-50">No completed events found.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible">
      <div className="overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Event Title</th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date Held</th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total Budget</th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="overflow-visible">
            {events.map((event, index) => (
              <tr key={event.id || index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-bold text-gray-800 text-sm">{event.title}</div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {new Date(event.date).toLocaleDateString('en-GB')}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  {event.location}
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                  {event.requiredAmount ? `$${event.requiredAmount}` : 'N/A'}
                </td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-600 border border-green-200 flex items-center w-fit gap-1">
                    <FontAwesomeIcon icon={faCheckCircle} /> Completed
                  </span>
                </td>
                <td className="py-4 px-6 text-right relative dropdown-container">
                  <button
                    onClick={() => setOpenDropdownId(openDropdownId === event.id ? null : event.id)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>

                  {openDropdownId === event.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden animate-fade-in-up origin-top-right">
                      <button
                        onClick={() => { onView(event); setOpenDropdownId(null); }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <FontAwesomeIcon icon={faEye} className="text-gray-400" /> View Details
                      </button>
                      <button
                        onClick={() => { onEdit(event); setOpenDropdownId(null); }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-blue-400" /> Edit Event
                      </button>
                      <div className="border-t border-gray-50"></div>
                      <button
                        onClick={() => { onUndo(event); setOpenDropdownId(null); }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <FontAwesomeIcon icon={faUndo} className="text-red-400" /> Mark Incomplete
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

const Events = () => {
  // State
  const [recentEvents, setRecentEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Added search state

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    image: null,
    requiredAmount: '',
    collectedAmount: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    requiredAmount: '',
    collectedAmount: '',
    image: null,
    oldImage: ''
  });

  // Init Mock Data
  // Fetch Events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${Domain()}/events/getallevent`);
      if (response.data.success) {
        const allEvents = response.data.events;
        const recent = allEvents.filter(e => e.status !== 'Completed');
        const completed = allEvents.filter(e => e.status === 'Completed');

        setRecentEvents(recent);
        setCompletedEvents(completed);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter Logic
  const filteredRecentEvents = recentEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompletedEvents = completedEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleCreateOpen = () => {
    setCreateForm({ title: '', description: '', location: '', date: '', time: '', image: null, requiredAmount: '', collectedAmount: '' });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', createForm.title);
      formData.append('description', createForm.description);
      formData.append('date', createForm.date);
      formData.append('time', createForm.time);
      formData.append('location', createForm.location);
      formData.append('requiredAmount', createForm.requiredAmount || 0);
      formData.append('collectedAmount', createForm.collectedAmount || 0);
      if (createForm.image) {
        formData.append('image', createForm.image);
      }

      const response = await axios.post(`${Domain()}/events/create/event`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        Swal.fire('Success', 'Event created and saved to database successfully!', 'success');
        setShowCreateModal(false);
        fetchEvents(); // Refresh list
      }
    } catch (error) {
      console.error("Create event error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      Swal.fire('Error', `Failed: ${errorMessage}`, 'error');
    }
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: event.time,
      location: event.location,
      requiredAmount: event.requiredAmount || 0,
      collectedAmount: event.collectedAmount || 0,
      image: null,
      oldImage: event.image
    });
    setIsEditing(false);
    setShowDetailModal(true);
  };

  const handleEditOpen = (event) => {
    setSelectedEvent(event);
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      time: event.time,
      location: event.location,
      requiredAmount: event.requiredAmount || 0,
      collectedAmount: event.collectedAmount || 0,
      image: null,
      oldImage: event.image
    });
    setIsEditing(true);
    setShowDetailModal(true);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset form if cancelling
    if (isEditing) {
      setEditForm({
        title: selectedEvent.title,
        description: selectedEvent.description,
        date: selectedEvent.date ? new Date(selectedEvent.date).toISOString().split('T')[0] : '',
        time: selectedEvent.time,
        location: selectedEvent.location,
        requiredAmount: selectedEvent.requiredAmount || 0,
        collectedAmount: selectedEvent.collectedAmount || 0,
        image: null,
        oldImage: selectedEvent.image
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditForm({ ...editForm, image: e.target.files[0] });
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);
      formData.append('date', editForm.date);
      formData.append('time', editForm.time);
      formData.append('location', editForm.location);
      formData.append('requiredAmount', editForm.requiredAmount || 0);
      formData.append('collectedAmount', editForm.collectedAmount || 0);

      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      const response = await axios.put(`${Domain()}/events/update/${selectedEvent._id || selectedEvent.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        Swal.fire('Success', 'Event updated successfully!', 'success');
        setIsEditing(false);
        // Refresh full data from backend or partially update local state with response
        setSelectedEvent(response.data.event);
        fetchEvents(); // Refresh lists to show new image thumbnail
      }
    } catch (error) {
      console.error("Error updating event:", error);
      Swal.fire('Error', 'Failed to update event', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Assume API call here as well for real deletion if needed,
        // for now just UI as per original snippet logic, but technically needs axios.delete
        // setRecentEvents(recentEvents.filter(e => e.id !== id));
        // Adding real delete for completeness since we have the ID
        axios.delete(`${Domain()}/events/delete/${id}`).then(res => {
          if (res.data.success) {
            Swal.fire('Deleted!', 'Event has been deleted.', 'success');
            fetchEvents();
          }
        }).catch(err => Swal.fire('Error', 'Failed to delete event', 'error'));
      }
    });
  };

  const handleComplete = async () => {
    try {
      const response = await axios.put(`${Domain()}/events/update/${selectedEvent._id || selectedEvent.id}`, {
        ...selectedEvent,
        location: editForm.location,
        requiredAmount: editForm.requiredAmount,
        status: 'Completed'
      }, {
        headers: { 'Content-Type': 'application/json' } // Ensure JSON content type if needed, though axios usually handles it
      });

      if (response.data.success) {
        Swal.fire('Completed!', 'Event marked as completed.', 'success');
        setShowDetailModal(false);
        fetchEvents(); // Refresh to update lists
      }
    } catch (error) {
      console.error("Error completing event:", error);
      Swal.fire('Error', 'Failed to mark event as completed.', 'error');
    }
  };

  const handleUndoComplete = async (event) => {
    try {
      const response = await axios.put(`${Domain()}/events/update/${event._id || event.id}`, {
        ...event,
        status: 'Incomplete'
      });

      if (response.data.success) {
        Swal.fire('Restored!', 'Event moved back to active events.', 'success');
        fetchEvents();
      }
    } catch (error) {
      console.error("Error restoring event:", error);
      Swal.fire('Error', 'Failed to restore event.', 'error');
    }
  };

  const handleEditCompleted = (event) => {
    // Just reuse view for now, usually editing completed events is same as viewing with ability to change
    // or we can show a specific alert saying "Editing completed event"
    handleEditOpen(event);
  };

  const handleExport = () => {
    const headers = ['Title', 'Date', 'Location', 'Budget Raised'];
    const rows = completedEvents.map(e => [`"${e.title}"`, `"${e.date}"`, `"${e.location}"`, `"${e.budgetRaised || 0}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "completed_events.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-handwriting text-gray-800" style={{ fontFamily: '"Patrick Hand", cursive' }}>Events Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage comprehensive events, schedules, and details.</p>
          </div>
          <button
            onClick={handleCreateOpen}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg shadow-gray-200"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Event
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex gap-4">
          <div className="relative flex-grow">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Recent Events Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 font-handwriting">Recent Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecentEvents.map(event => (
              <EventCard key={event.id} event={event} onView={handleView} onEdit={handleEditOpen} onDelete={handleDelete} />
            ))}
          </div>
          {filteredRecentEvents.length === 0 && (
            <p className="text-gray-500 italic">No matching events found.</p>
          )}
        </div>

        {/* Completed Events Table */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 font-handwriting">Completed Events</h2>
            <button onClick={handleExport} className="text-sm text-gray-500 hover:text-gray-800 flex items-center border px-3 py-1 rounded bg-white">
              <FontAwesomeIcon icon={faDownload} className="mr-2" /> Export CSV
            </button>
          </div>
          <CompletedTable
            events={filteredCompletedEvents}
            onExport={handleExport}
            onView={handleView}
            onUndo={handleUndoComplete}
            onEdit={handleEditCompleted}
          />
        </div>

      </div>

      {/* --- MODALS --- */}

      {/* 1. Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Create New Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm" value={createForm.title} onChange={e => setCreateForm({ ...createForm, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea rows="2" className="w-full border border-gray-300 rounded p-2 text-sm" value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} required></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded p-2 text-sm" value={createForm.date} onChange={e => setCreateForm({ ...createForm, date: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                  <input type="time" className="w-full border border-gray-300 rounded p-2 text-sm" value={createForm.time} onChange={e => setCreateForm({ ...createForm, time: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                  <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm" value={createForm.location} onChange={e => setCreateForm({ ...createForm, location: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Budget Required (Opt)</label>
                  <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={createForm.requiredAmount} onChange={e => setCreateForm({ ...createForm, requiredAmount: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Collected Amount (Opt)</label>
                <input type="number" className="w-full border border-gray-300 rounded p-2 text-sm" value={createForm.collectedAmount} onChange={e => setCreateForm({ ...createForm, collectedAmount: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Picture (Optional)</label>
                <div className="border border-dashed border-gray-300 rounded p-4 text-center text-gray-400 text-sm hover:bg-gray-50 cursor-pointer relative">
                  <input
                    type="file"
                    onChange={(e) => setCreateForm({ ...createForm, image: e.target.files[0] })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                  <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                  {createForm.image ? createForm.image.name : "Click to upload image"}
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-black transition-colors">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Event Details Modal - New 2-Column Design */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row max-h-[90vh]">

            {/* Close Button Mobile */}
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 md:hidden z-10"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>

            {/* Left Column: Image & Description */}
            <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col gap-6 overflow-y-auto">

              {/* Image Box */}
              <div className="bg-gray-200 rounded-xl w-full aspect-video flex items-center justify-center overflow-hidden relative group">
                <img
                  src={
                    editForm.image && editForm.image instanceof File
                      ? URL.createObjectURL(editForm.image)
                      : `http://localhost:8000/${(editForm.image || selectedEvent.image || '').replace(/\\/g, '/')}`
                  }
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = '/default-event.jpg'}
                />

                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg font-bold shadow-sm hover:scale-105 transition-transform flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileUpload} /> Change
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Description Box */}
              <div className="bg-gray-200 rounded-xl w-full p-4 flex-1 min-h-[150px]">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Description Text</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

            </div>

            {/* Right Column: Details & Form */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col h-full overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 mr-4">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">TITLE:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1 text-2xl font-bold text-gray-800"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold text-gray-800 leading-tight">{selectedEvent.title}</h2>
                  )}
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {/* Date & Location Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">DATE:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleEditChange}
                        className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1 text-lg font-medium text-gray-800"
                      />
                    ) : (
                      <div className="text-lg font-medium text-gray-800 mt-1">
                        {new Date(selectedEvent.date).toLocaleDateString('en-GB')}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">TIME:</span>
                    {isEditing ? (
                      <input
                        type="time"
                        name="time"
                        value={editForm.time}
                        onChange={handleEditChange}
                        className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1 text-lg font-medium text-gray-800"
                      />
                    ) : (
                      <div className="text-lg font-medium text-gray-800 mt-1">
                        {selectedEvent.time}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">LOCATION:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editForm.location}
                        onChange={handleEditChange}
                        className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1 text-lg font-medium text-gray-800"
                      />
                    ) : (
                      <div className="text-lg font-medium text-gray-800 mt-1 truncate" title={selectedEvent.location}>
                        {selectedEvent.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 my-4"></div>

                {/* Description */}
                <div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wide block mb-2">DESCRIPTION:</span>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      rows="4"
                      className="w-full border border-gray-200 rounded-lg p-3 text-gray-600 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed overflow-y-auto max-h-40 scroller">
                      {selectedEvent.description}
                    </p>
                  )}
                </div>


                <div className="border-t border-gray-100 my-4"></div>

                {/* Financials */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center group">
                    <span className="text-sm font-bold text-gray-500 uppercase">total amount:</span>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center">
                          <span className="font-bold text-gray-500 mr-1">$</span>
                          <input
                            type="number"
                            name="requiredAmount"
                            value={editForm.requiredAmount}
                            onChange={handleEditChange}
                            className="w-24 border-b border-gray-300 focus:border-indigo-500 outline-none font-bold text-gray-800 text-right"
                          />
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-800">${selectedEvent.requiredAmount || 0}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500 uppercase">collected amount:</span>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center">
                          <span className="font-bold text-gray-500 mr-1">$</span>
                          <input
                            type="number"
                            name="collectedAmount"
                            value={editForm.collectedAmount}
                            onChange={handleEditChange}
                            className="w-24 border-b border-gray-300 focus:border-indigo-500 outline-none font-bold text-green-600 text-right"
                          />
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-green-600">${selectedEvent.collectedAmount || 0}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500 uppercase">remaining amount:</span>
                    <span className="text-lg font-bold text-red-500">
                      ${((isEditing ? editForm.requiredAmount : selectedEvent.requiredAmount) || 0) - ((isEditing ? editForm.collectedAmount : selectedEvent.collectedAmount) || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3 pt-4 border-t border-gray-50">
                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateEvent}
                      className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="w-1/3 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-transform active:scale-[0.98] shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleComplete}
                      className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-transform active:scale-[0.98] shadow-lg"
                    >
                      Mark as Completed
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default Events;