import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./Login/Login";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Posts from "./Admin/Posts/Posts";

import Add from "./Admin/Posts/NewPost";
import View from "./Admin/Posts/ViewPost";
import UpdatePost from "./Admin/Posts/UpdatePost";
import Logout from "./Login/Logout";  // If you still need it
import NotFound from "./layouts/PageNotFound";
import Events from "./Admin/event/Events";
import AddEventpage from "./Admin/event/addEvent";
import UpdateEvent from "./Admin/event/updateEvent";
import ProtectedRoute from './ProtectedRoute';
import Team from "./Admin/team/Team";
import UpdateTeam from "./Admin/team/UpdateTeam";
import Program from "./Admin/program/program";
import UpdateProgram from "./Admin/program/updateProgram";
import AddProgram from "./Admin/program/addProgram";
import Contact from "./Admin/contact/contact";
import EventParticipants from "./Admin/event/EventParticipants";
import ProgramParticipants from "./Admin/program/ProgramParticipants";

import Donations from "./Admin/Donation/Donation.jsx";
import Settings from "./Admin/Settings/Settings";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Logout" element={<Logout />} />
        {/* Public Home (optional) */}

        {/* Protected Admin Pages */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/Admin/Settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/Admin/Posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
        <Route path="/Admin/Post/New" element={<ProtectedRoute><Add /></ProtectedRoute>} />
        <Route path="/Admin/Posts/Update/:id" element={<ProtectedRoute><UpdatePost /></ProtectedRoute>} />
        <Route path="/Admin/Posts/:id" element={<ProtectedRoute><View /></ProtectedRoute>} />
        <Route path="/Admin/Events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/Admin/Event/New" element={<ProtectedRoute><AddEventpage /></ProtectedRoute>} />
        <Route path="/Admin/Event/Update/:id" element={<ProtectedRoute><UpdateEvent /></ProtectedRoute>} />
        <Route path="/Admin/Donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />

        <Route path="/Admin/Team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
        <Route path="/Admin/Team/Update/:id" element={<ProtectedRoute><UpdateTeam /></ProtectedRoute>} />
        <Route path="/Admin/Program" element={<ProtectedRoute><Program /></ProtectedRoute>} />
        <Route path="/Admin/Program/New" element={<ProtectedRoute><AddProgram /></ProtectedRoute>} />
        <Route path="/Admin/Program/Update/:id" element={<ProtectedRoute><UpdateProgram /></ProtectedRoute>} />
        <Route path="/Admin/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

        {/* Participant Management Routes */}
        <Route path="/Admin/Event/Participants/:eventId" element={<ProtectedRoute><EventParticipants /></ProtectedRoute>} />
        <Route path="/Admin/Program/Participants/:programId" element={<ProtectedRoute><ProgramParticipants /></ProtectedRoute>} />


        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
