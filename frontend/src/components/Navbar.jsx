import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="nav">
      <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
        Industry Readiness
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> {user.name} ({user.role})
            </span>
            <button onClick={handleLogout} className="btn-primary" style={{ backgroundColor: 'transparent', border: '1px solid white', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-primary" style={{ backgroundColor: 'transparent' }}>Login</Link>
            <Link to="/register" className="btn-accent">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
