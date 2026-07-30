import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Full name is required';
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setSubmitting(true);
    const res = await register(name, email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/projects');
    } else {
      setApiError(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem 1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div className="flex flex-col items-center gap-2" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: 'var(--radius-lg)' }}>
            <CheckSquare size={36} color="#6366f1" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Join your team and manage tasks seamlessly
          </p>
        </div>

        {apiError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              fontSize: '0.875rem',
              marginBottom: '1.5rem'
            }}
          >
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {formErrors.name && <span className="form-error">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {formErrors.email && <span className="form-error">{formErrors.email}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="•••••••• (Min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {formErrors.password && <span className="form-error">{formErrors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? (
              <div className="spinner" style={{ width: '18px', height: '18px' }}></div>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
