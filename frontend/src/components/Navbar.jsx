import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, LogOut, User as UserIcon, FolderKanban } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container flex items-center justify-between">
        <Link to="/projects" className="nav-brand">
          <CheckSquare size={26} color="#6366f1" />
          <span>TaskPulse</span>
        </Link>

        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <Link to="/projects" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
              <FolderKanban size={16} />
              <span>Projects</span>
            </Link>

            <div className="flex items-center gap-2" style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
              <UserIcon size={16} className="text-muted" />
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</span>
              <span
                className="badge"
                style={{
                  backgroundColor: user.role === 'Admin' ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)',
                  color: user.role === 'Admin' ? '#fca5a5' : '#a5b4fc',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '0.6875rem'
                }}
              >
                {user.role}
              </span>
            </div>

            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem' }}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
