import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Plus,
  Filter,
  Users,
  UserPlus,
  UserX,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const { user: currentUser } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStatus, setTaskStatus] = useState('To Do');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submittingTask, setSubmittingTask] = useState(false);

  // Member add state
  const [selectedUserId, setSelectedUserId] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const fetchProjectDetails = useCallback(async () => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      if (res.data.success) {
        setProject(res.data.data.project);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project');
    }
  }, [projectId]);

  const fetchTasks = useCallback(async () => {
    try {
      let queryParams = [];
      if (statusFilter) queryParams.push(`status=${encodeURIComponent(statusFilter)}`);
      if (priorityFilter) queryParams.push(`priority=${encodeURIComponent(priorityFilter)}`);
      if (assigneeFilter) queryParams.push(`assignee=${encodeURIComponent(assigneeFilter)}`);

      const queryStr = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const res = await api.get(`/projects/${projectId}/tasks${queryStr}`);
      if (res.data.success) {
        setTasks(res.data.data.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  }, [projectId, statusFilter, priorityFilter, assigneeFilter]);

  const fetchAllUsers = async () => {
    try {
      const res = await api.get('/users');
      if (res.data.success) {
        setAllUsers(res.data.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchProjectDetails();
      await fetchTasks();
      await fetchAllUsers();
      setLoading(false);
    };
    init();
  }, [fetchProjectDetails, fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const isCreator = project?.createdBy?._id === currentUser?._id || project?.createdBy === currentUser?._id;
  const canManageMembers = isCreator || currentUser?.role === 'Admin';

  const openCreateTaskModal = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskStatus('To Do');
    setTaskPriority('Medium');
    setTaskDueDate('');
    setTaskAssignee('');
    setFormErrors({});
    setShowTaskModal(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description || '');
    setTaskStatus(task.status);
    setTaskPriority(task.priority);
    setTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setTaskAssignee(task.assignee?._id || '');
    setFormErrors({});
    setShowTaskModal(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setFormErrors({ title: 'Task title is required' });
      return;
    }

    try {
      setSubmittingTask(true);
      const payload = {
        title: taskTitle,
        description: taskDesc,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate || null,
        assignee: taskAssignee || null
      };

      if (editingTask) {
        await api.patch(`/projects/${projectId}/tasks/${editingTask._id}`, payload);
      } else {
        await api.post(`/projects/${projectId}/tasks`, payload);
      }

      setShowTaskModal(false);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleQuickStatusChange = async (task, newStatus) => {
    try {
      await api.patch(`/projects/${projectId}/tasks/${task._id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/projects/${projectId}/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;

    try {
      setAddingMember(true);
      const res = await api.post(`/projects/${projectId}/members`, { userId: selectedUserId });
      if (res.data.success) {
        setProject(res.data.data.project);
        setSelectedUserId('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (targetUserId) => {
    if (!window.confirm('Remove this member from project?')) return;

    try {
      const res = await api.delete(`/projects/${projectId}/members/${targetUserId}`);
      if (res.data.success) {
        setProject(res.data.data.project);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '80vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div className="card" style={{ color: 'var(--danger)', padding: '2rem', textAlign: 'center' }}>
          <h3>{error || 'Project not found'}</h3>
          <Link to="/projects" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const columns = ['To Do', 'In Progress', 'Done'];

  // Non-member users available to add
  const availableUsersToAdd = allUsers.filter(
    (u) => !project.members?.some((m) => m._id === u._id || m === u._id)
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Header section */}
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/projects"
          className="flex items-center gap-1"
          style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{project.name}</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '700px' }}>
              {project.description || 'No description provided.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowMemberModal(true)} className="btn btn-secondary">
              <Users size={18} />
              <span>Members ({project.members?.length || 1})</span>
            </button>
            <button onClick={openCreateTaskModal} className="btn btn-primary">
              <Plus size={18} />
              <span>Create Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card flex items-center justify-between"
        style={{ padding: '1rem 1.25rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div className="flex items-center gap-2" style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <Filter size={16} />
          <span>Filters:</span>
        </div>

        <div className="flex items-center gap-3" style={{ flexWrap: 'wrap', flex: 1, maxWidth: '700px' }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', flex: 1, minWidth: '130px', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            className="form-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ width: 'auto', flex: 1, minWidth: '130px', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            className="form-select"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            style={{ width: 'auto', flex: 1, minWidth: '160px', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
          >
            <option value="">All Assignees</option>
            {project.members?.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>

          {(statusFilter || priorityFilter || assigneeFilter) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setPriorityFilter('');
                setAssigneeFilter('');
              }}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="kanban-grid">
        {columns.map((colStatus) => {
          const colTasks = tasks.filter((t) => t.status === colStatus);

          return (
            <div key={colStatus} className="kanban-column">
              <div className="kanban-column-header">
                <div className="flex items-center gap-2">
                  <span
                    className={`badge badge-${colStatus.toLowerCase().replace(' ', '')}`}
                  >
                    {colStatus}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {colTasks.length === 0 ? (
                <div
                  style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: '0.5rem'
                  }}
                >
                  No tasks in {colStatus}
                </div>
              ) : (
                colTasks.map((task) => (
                  <div
                    key={task._id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      background: 'rgba(30, 41, 59, 0.9)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.4 }}>
                        {task.title}
                      </h4>
                      <span
                        className={`priority-${task.priority.toLowerCase()}`}
                        style={{ fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}
                      >
                        ● {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {task.description}
                      </p>
                    )}

                    <div
                      className="flex items-center justify-between"
                      style={{
                        paddingTop: '0.75rem',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '0.78125rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar size={13} />
                        <span>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : 'No due date'}
                        </span>
                      </div>
                      <div>
                        {task.assignee ? (
                          <span style={{ color: '#a5b4fc', fontWeight: 600 }}>
                            @{task.assignee.name}
                          </span>
                        ) : (
                          <span style={{ fontStyle: 'italic' }}>Unassigned</span>
                        )}
                      </div>
                    </div>

                    {/* Quick actions bar */}
                    <div className="flex items-center justify-between" style={{ marginTop: '0.25rem' }}>
                      <div className="flex items-center gap-1">
                        {colStatus !== 'To Do' && (
                          <button
                            onClick={() => handleQuickStatusChange(task, 'To Do')}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            title="Move to To Do"
                          >
                            To Do
                          </button>
                        )}
                        {colStatus !== 'In Progress' && (
                          <button
                            onClick={() => handleQuickStatusChange(task, 'In Progress')}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            title="Move to In Progress"
                          >
                            In Progress
                          </button>
                        )}
                        {colStatus !== 'Done' && (
                          <button
                            onClick={() => handleQuickStatusChange(task, 'Done')}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            title="Move to Done"
                          >
                            Done
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditTaskModal(task)}
                          className="btn btn-secondary btn-icon"
                          style={{ padding: '0.35rem' }}
                          title="Edit Task"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="btn btn-danger btn-icon"
                          style={{ padding: '0.35rem' }}
                          title="Delete Task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Task Create / Edit Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>

            <form onSubmit={handleTaskSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Implement user login API"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
                {formErrors.title && <span className="form-error">{formErrors.title}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Detailed task description..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                ></textarea>
              </div>

              <div className="flex gap-3" style={{ marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3" style={{ marginBottom: '1.75rem' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Assignee</label>
                  <select
                    className="form-select"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {project.members?.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={submittingTask}
                >
                  {submittingTask ? (
                    <div className="spinner" style={{ width: '18px', height: '18px' }}></div>
                  ) : editingTask ? (
                    'Save Changes'
                  ) : (
                    'Create Task'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Management Modal */}
      {showMemberModal && (
        <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Project Members
            </h2>

            {/* Add member form if permitted */}
            {canManageMembers && (
              <form
                onSubmit={handleAddMember}
                className="flex items-center gap-2"
                style={{ marginBottom: '1.5rem' }}
              >
                <select
                  className="form-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="">Select user to add...</option>
                  {availableUsersToAdd.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!selectedUserId || addingMember}
                >
                  {addingMember ? <div className="spinner" style={{ width: '16px', height: '16px' }}></div> : <UserPlus size={16} />}
                </button>
              </form>
            )}

            <div className="flex flex-col gap-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {project.members?.map((member) => {
                const isProjectCreator = project.createdBy?._id === member._id || project.createdBy === member._id;

                return (
                  <div
                    key={member._id}
                    className="flex items-center justify-between"
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{member.name}</div>
                      <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                        {member.email}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isProjectCreator ? (
                        <span className="badge" style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                          Owner
                        </span>
                      ) : canManageMembers ? (
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          className="btn btn-danger btn-icon"
                          title="Remove member"
                        >
                          <UserX size={16} />
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowMemberModal(false)}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
