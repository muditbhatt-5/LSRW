import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ParagraphReader from './pages/ParagraphReader.jsx';
import ParagraphListener from './pages/ParagraphListener.jsx';
import Exam from './pages/Exam.jsx';
import UserLayout from './pages/UserLayout.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-transparent text-slate-100 selection:bg-cyan-500 selection:text-white relative overflow-hidden font-sans">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected routes for regular users */}
            <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/paragraph-reader" element={<ParagraphReader />} />
              <Route path="/paragraph-listener" element={<ParagraphListener />} />
              <Route path="/exam" element={<Exam />} />
            </Route>

            {/* Catch-all redirect to dashboard if logged in, or login */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
