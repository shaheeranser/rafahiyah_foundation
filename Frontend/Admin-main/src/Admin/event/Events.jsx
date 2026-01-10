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
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import AdminLayout from "../../layouts/AdminLayout";

// --- Components ---

// 1. Recent Event Card
const EventCard = ({ event, onView, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative">
      <div className="h-40 bg-gray-100 relative overflow-hidden">
        <img
          src={event.image}
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

        <div className="flex items-center text-gray-500 text-sm mb-1">
          <FontAwesomeIcon icon={faClock} className="w-4 mr-2 text-indigo-400" />
          {event.time}
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 mr-2 text-pink-500" />
          {event.location}
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-50">
          <button
            onClick={() => onView(event)}
            className="flex-1 bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faEye} /> View
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="w-10 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 py-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Completed Events Table
const CompletedTable = ({ events, onExport }) => {
  if (!events || events.length === 0) {
    return <div className="p-12 text-center text-gray-400 border border-dashed rounded-xl bg-gray-50">No completed events found.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Event Title</th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date Held</th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total Budget</th>
              <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
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
                  {event.budgetRaised ? `$${event.budgetRaised}` : 'N/A'}
                </td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-600 border border-green-200 flex items-center w-fit gap-1">
                    <FontAwesomeIcon icon={faCheckCircle} /> Completed
                  </span>
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
    requiredAmount: ''
  });

  const [editForm, setEditForm] = useState({
    location: '',
    requiredAmount: ''
  });

  // Init Mock Data
  useEffect(() => {
    const mockRecent = [
      { id: 1, title: 'Charity Gala Dinner', description: 'Annual fundraising dinner.', location: 'Grand Hotel, NY', date: '2025-12-25', time: '18:00', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865', requiredAmount: 5000, collectedAmount: 3500 },
      { id: 2, title: 'Community Cleanup', description: 'Cleaning the local park.', location: 'Central Park', date: '2026-01-10', time: '09:00', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978', requiredAmount: 200, collectedAmount: 50 }
    ];
    const mockCompleted = [
      { id: 3, title: 'Winter Clothing Drive', description: 'Collecting coats for the homeless.', location: 'Community Center', date: '2024-11-15', time: '10:00', budgetRaised: 1500, requiredAmount: 1500, collectedAmount: 1500 }
    ];

    setRecentEvents(mockRecent);
    setCompletedEvents(mockCompleted);
  }, []);

  // Handlers
  const handleCreateOpen = () => {
    setCreateForm({ title: '', description: '', location: '', date: '', time: '', image: null, requiredAmount: '' });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      ...createForm,
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30', // Placeholder for uploaded img
      collectedAmount: 0 // Init with 0
    };
    setRecentEvents([newEvent, ...recentEvents]);
    setShowCreateModal(false);
    Swal.fire('Success', 'Event created successfully!', 'success');
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setEditForm({ location: event.location, requiredAmount: event.requiredAmount || '' });
    setShowDetailModal(true);
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
        setRecentEvents(recentEvents.filter(e => e.id !== id));
        Swal.fire('Deleted!', 'Event has been deleted.', 'success');
      }
    });
  };

  const handleComplete = () => {
    // Move to completed
    const completed = { ...selectedEvent, location: editForm.location, budgetRaised: editForm.requiredAmount }; // Assuming raised = required for simplicity or user edits it
    setCompletedEvents([completed, ...completedEvents]);
    setRecentEvents(recentEvents.filter(e => e.id !== selectedEvent.id));
    setShowDetailModal(false);
    Swal.fire('Completed!', 'Event marked as completed.', 'success');
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
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-handwriting text-gray-800" style={{ fontFamily: '"Patrick Hand", cursive' }}>Events Management</h1>
          </div>
          <button
            onClick={handleCreateOpen}
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg shadow-gray-200"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Event
          </button>
        </div>

        {/* Recent Events Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 font-handwriting">Recent Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map(event => (
              <EventCard key={event.id} event={event} onView={handleView} onDelete={handleDelete} />
            ))}
          </div>
        </div>

        {/* Completed Events Table */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 font-handwriting">Completed Events</h2>
            <button onClick={handleExport} className="text-sm text-gray-500 hover:text-gray-800 flex items-center border px-3 py-1 rounded bg-white">
              <FontAwesomeIcon icon={faDownload} className="mr-2" /> Export CSV
            </button>
          </div>
          <CompletedTable events={completedEvents} />
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
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Picture (Optional)</label>
                <div className="border border-dashed border-gray-300 rounded p-4 text-center text-gray-400 text-sm hover:bg-gray-50 cursor-pointer">
                  <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
                  Click to upload image
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
                {selectedEvent.image ? (
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/default-event.jpg'}
                  />
                ) : (
                  <span className="text-gray-500 font-medium">relevant picture</span>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button className="bg-white/90 text-gray-800 px-3 py-1 rounded shadow-sm text-xs font-bold">Change</button>
                </div>
              </div>

              {/* Description Box */}
              <div className="bg-gray-200 rounded-xl w-full p-4 flex-1 min-h-[150px]">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Description Text</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

            </div>

            {/* Right Column: Details & Actions */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto">

              <div className="space-y-6">
                {/* Header (Title) */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">Title:</span>
                    <h2 className="text-3xl font-bold text-gray-900 mt-1">{selectedEvent.title}</h2>
                  </div>
                  <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 hidden md:block">
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                </div>

                {/* Date & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">DATE:</span>
                    <div className="text-xl font-medium text-gray-800 mt-1">
                      {new Date(selectedEvent.date).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">LOCATION:</span>
                    <div className="text-xl font-medium text-gray-800 mt-1 truncate" title={selectedEvent.location}>
                      {selectedEvent.location}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-4"></div>

                {/* Financials */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center group">
                    <span className="text-sm font-bold text-gray-500 uppercase">total amount:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-800">${selectedEvent.requiredAmount || 0}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500 uppercase">collected amount:</span>
                    <span className="text-lg font-bold text-green-600">${selectedEvent.collectedAmount || 0}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500 uppercase">remaining amount:</span>
                    <span className="text-lg font-bold text-red-500">
                      ${(selectedEvent.requiredAmount || 0) - (selectedEvent.collectedAmount || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 space-y-3">
                <button className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-transform active:scale-[0.98] shadow-sm">
                  Edit
                </button>
                <button
                  onClick={handleComplete}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-transform active:scale-[0.98] shadow-lg shadow-indigo-200"
                >
                  Mark as Completed
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default Events;