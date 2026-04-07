import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Placeholders for pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CandidateDashboard from './pages/CandidateDashboard';
import ValidatorDashboard from './pages/ValidatorDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import ValidatorProfile from './pages/ValidatorProfile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role.toLowerCase()}`} /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role.toLowerCase()}`} /> : <RegisterPage />} />
      
      <Route path="/candidate" element={
        <ProtectedRoute allowedRoles={['CANDIDATE']}>
          <CandidateDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/validator" element={
        <ProtectedRoute allowedRoles={['VALIDATOR']}>
          <ValidatorDashboard />
        </ProtectedRoute>
      } />

      <Route path="/validator-profile/:id" element={
        <ProtectedRoute>
          <ValidatorProfile />
        </ProtectedRoute>
      } />

      <Route path="/recruiter" element={
        <ProtectedRoute allowedRoles={['RECRUITER']}>
          <RecruiterDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
