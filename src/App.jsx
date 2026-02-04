import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import { LoginPage, RegisterPage } from './pages/Auth';
import { ChatPage } from './pages/Chat';
import { ConfessionPage } from './pages/Confession';
import { AppointmentPage } from './pages/Appointment';
import { GuidePage } from './pages/Guide';
import { TeacherDashboard } from './pages/Dashboard';
import { StudentProfileEditor, TeacherProfileEditor } from './pages/Profile';
import { AdminDashboard, AdminSetup } from './pages/Admin';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Main Features */}
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/confession" element={<ConfessionPage />} />
                    <Route path="/appointment" element={<AppointmentPage />} />
                    <Route path="/guide" element={<GuidePage />} />

                    {/* Teacher Dashboard */}
                    <Route path="/dashboard" element={<TeacherDashboard />} />

                    {/* Admin Dashboard */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/setup" element={<AdminSetup />} />

                    {/* Profile Editors */}
                    <Route path="/profile/student" element={<StudentProfileEditor />} />
                    <Route path="/profile/teacher" element={<TeacherProfileEditor />} />

                    {/* Catch all */}
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
