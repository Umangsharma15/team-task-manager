import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { CheckCircle, Clock, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  const { user, tasks, projects, fetchTasks, fetchProjects, updateTaskStatus, createProject, createTask, loading } = useStore();
  const [activeTab, setActiveTab] = useState('tasks');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', assigneeId: '' });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  if (loading && tasks.length === 0) return <div className="container mt-8">Loading...</div>;

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  const handleStatusUpdate = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    await createProject(newProject.name, newProject.description);
    setShowProjectForm(false);
    setNewProject({ name: '', description: '' });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    await createTask(newTask);
    setShowTaskForm(false);
    setNewTask({ title: '', description: '', projectId: '', assigneeId: '' });
  };

  return (
    <div className="container animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name} ({user?.role})</p>
        </div>
        <div>
          {user?.role === 'ADMIN' && (
            <div className="flex gap-4">
              <button className="btn btn-secondary" onClick={() => setShowProjectForm(!showProjectForm)}>+ Project</button>
              <button className="btn btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>+ Task</button>
            </div>
          )}
        </div>
      </div>

      {showProjectForm && (
        <form className="card mb-8" onSubmit={handleCreateProject}>
          <h3>New Project</h3>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input required className="form-input" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input className="form-input" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary">Create</button>
        </form>
      )}

      {showTaskForm && (
        <form className="card mb-8" onSubmit={handleCreateTask}>
          <h3>New Task</h3>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input required className="form-input" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input className="form-input" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Project</label>
            <select required className="form-select" value={newTask.projectId} onChange={e => setNewTask({...newTask, projectId: e.target.value})}>
              <option value="">Select Project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Create</button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px' }}>
            <Clock color="var(--warning-color)" size={24} />
          </div>
          <div>
            <h3>{todoTasks.length}</h3>
            <p>To Do</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
            <CheckSquare color="var(--primary-color)" size={24} />
          </div>
          <div>
            <h3>{inProgressTasks.length}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px' }}>
            <CheckCircle color="var(--success-color)" size={24} />
          </div>
          <div>
            <h3>{doneTasks.length}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('tasks')}
        >
          My Tasks
        </button>
        <button 
          className={`btn ${activeTab === 'projects' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects Overview
        </button>
      </div>

      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 gap-4">
          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="card flex justify-between items-center">
                <div>
                  <h4>{task.title}</h4>
                  <p style={{ fontSize: '0.875rem' }}>Project: {task.project?.name} | Assignee: {task.assignee?.name || 'Unassigned'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <select 
                    className="form-select" 
                    value={task.status} 
                    onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                    style={{ width: 'auto', padding: '0.5rem' }}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  <span className={`badge badge-${task.status === 'TODO' ? 'todo' : task.status === 'IN_PROGRESS' ? 'progress' : 'done'}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid grid-cols-2 gap-6">
          {projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            projects.map(project => (
              <div key={project.id} className="card">
                <h4>{project.name}</h4>
                <p className="mb-4">{project.description}</p>
                <div className="flex justify-between items-center" style={{ fontSize: '0.875rem' }}>
                  <span>{project.members?.length || 0} Members</span>
                  <span>{project.tasks?.length || 0} Tasks</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
