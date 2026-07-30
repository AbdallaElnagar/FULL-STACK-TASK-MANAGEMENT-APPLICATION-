import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FolderPlus, Users, Calendar, Trash2, ArrowRight, FolderKanban } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New Project Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);

  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      if (res.data.success) {
        setProjects(res.data.data.projects);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const validateModal = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Project name is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!validateModal()) return;

    try {
      setCreating(true);
      const res = await api.post('/projects', { name, description });
      if (res.data.success) {
        setShowModal(false);
        setName('');
        setDescription('');
        fetchProjects();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this project and all its tasks?')) return;

    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800 }}>Projects Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Manage and collaborate on team projects
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <FolderPlus size={18} />
          <span>New Project</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center" style={{ minHeight: '300px' }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="card" style={{ color: 'var(--danger)', padding: '1.5rem' }}>
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div
          className="card flex flex-col items-center justify-center"
          style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(30, 41, 59, 0.4)' }}
        >
          <FolderKanban size={54} color="#6366f1" style={{ marginBottom: '1rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Projects Found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0.5rem 0 1.5rem 0' }}>
            You don't have any projects assigned or created yet. Create a new project to get started!
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <FolderPlus size={18} />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {projects.map((project) => {
            const isCreator = project.createdBy?._id === user?._id || project.createdBy === user?._id;
            const canDelete = isCreator || user?.role === 'Admin';

            return (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="card flex flex-col justify-between"
                style={{ textDecoration: 'none', color: 'inherit', height: '100%', minHeight: '220px' }}
              >
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {project.name}
                    </h3>
                    {canDelete && (
                      <button
                        onClick={(e) => handleDeleteProject(e, project._id)}
                        className="btn btn-danger btn-icon"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div>
                  <div
                    className="flex items-center justify-between"
                    style={{
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-color)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{project.members?.length || 1} Members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between" style={{ marginTop: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Created by {project.createdBy?.name || 'Admin'}
                    </span>
                    <span className="flex items-center gap-1" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                      View Board <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Modal to Create Project */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Create New Project
            </h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Project Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Website Overhaul"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {formErrors.name && <span className="form-error">{formErrors.name}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Brief summary of project goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={creating}
                >
                  {creating ? <div className="spinner" style={{ width: '18px', height: '18px' }}></div> : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
