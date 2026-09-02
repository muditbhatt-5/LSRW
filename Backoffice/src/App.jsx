import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import Layout from './Admin/Layout.jsx'; // Admin layout
import Login from './pages/Login.jsx';

// Admin-specific components
import AdminParagraphReaders from './Admin/AdminParagraphReaders.jsx';
import AdminParagraphListeners from './Admin/AdminParagraphListeners.jsx';
import Users from './Admin/Users.jsx';
import Mcqs from './Admin/Mcqs.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-transparent text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-hidden font-sans">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected admin routes with Layout */}
            <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="admin-paragraph-readers" element={<ProtectedRoute><AdminParagraphReaders /></ProtectedRoute>} />
              <Route path="admin-paragraph-listeners" element={<ProtectedRoute><AdminParagraphListeners /></ProtectedRoute>} />
              <Route path="mcqs" element={<ProtectedRoute><Mcqs /></ProtectedRoute>} />
            </Route>

            {/* Catch-all redirect to admin if logged in, or login */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
