import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useStore();
  
  if (!isAuthenticated) return null;
  
  return (
    <nav className="navbar">
      <div className="nav-brand">TeamFlow</div>
      <div className="flex items-center gap-4">
        <span style={{ fontSize: '0.875rem' }}>{user?.name}</span>
        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { fetchMe, token } = useStore();

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token, fetchMe]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        {/* We can add more routes for detailed project view here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
