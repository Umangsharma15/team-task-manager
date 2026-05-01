import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const useStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  projects: [],
  tasks: [],
  loading: false,
  error: null,

  // Auth Actions
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Login failed', loading: false });
      throw error;
    }
  },

  signup: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data.user, token: res.data.token, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Signup failed', loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, projects: [], tasks: [] });
  },

  fetchMe: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: res.data, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  // Project Actions
  fetchProjects: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      set({ projects: res.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to load projects', loading: false });
    }
  },

  createProject: async (name, description) => {
    try {
      const res = await axios.post(`${API_URL}/projects`, { name, description }, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      set((state) => ({ projects: [...state.projects, res.data] }));
    } catch (error) {
      set({ error: 'Failed to create project' });
      throw error;
    }
  },

  // Task Actions
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      set({ tasks: res.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to load tasks', loading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      const res = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      set((state) => ({ tasks: [res.data, ...state.tasks] }));
    } catch (error) {
      set({ error: 'Failed to create task' });
      throw error;
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const res = await axios.put(`${API_URL}/tasks/${taskId}/status`, { status }, {
        headers: { Authorization: `Bearer ${get().token}` }
      });
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? res.data : t)
      }));
    } catch (error) {
      set({ error: 'Failed to update task status' });
      throw error;
    }
  }
}));

export default useStore;
