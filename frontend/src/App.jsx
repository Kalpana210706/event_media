
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EventGallery from './components/EventGallery';

// 🔐 1. LOGIN COMPONENT (WITH SIGN UP LINK)
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Connecting to secure portal...');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role); // Roles standard context injection
        setLoggedIn(true);
      } else {
        setMessage(`❌ Error: ${data.error || 'Invalid Credentials'}`);
      }
    } catch (err) {
      setMessage('❌ Cannot connect to backend server. Ensure node engine is running.');
    }
  };

  if (loggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white px-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            EventMedia Portal
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Centralized Event & Media Hub</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="arjun@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg transition-all">
            Sign In
          </button>
        </form>

        {/* 🆕 DYNAMIC REGISTRATION TRIGGER LINK */}
        <div className="mt-6 text-center border-t border-slate-700/60 pt-4">
          <p className="text-xs text-slate-400">
            
            <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
              Create an Account (Sign Up)
            </Link>
          </p>
        </div>

        {message && (
          <div className="mt-6 p-3 bg-slate-900 text-center text-sm rounded-xl border border-slate-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// 📝 2. REGISTER COMPONENT (FOR NEW ACCOUNTS WITH DEFAULT MEMBER PRIVILEGES)
function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert('🚀 Account Created Successfully! Aap default Member mode mein read-only view access kar sakte hain.');
        navigate('/'); // Redirect user back to login root node
      } else {
        setError(data.error || 'Registration failed. Try again.');
      }
    } catch (err) {
      setError('❌ Backend Node structure error. Ensure auth route controller is up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-6 text-white">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center mb-2">
          Create Account
        </h2>
        <p className="text-xs text-slate-400 text-center mb-6">Join EventMedia to view, download and explore clusters.</p>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-400 text-xs p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Arjun Singh"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">Secure Password</label>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-1">Account Purpose (Role)</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 transition font-medium"
            >
              <option value="MEMBER">Standard Attendee / Viewer Mode (Read-Only)</option>
              <option value="PHOTOGRAPHER">Campus Photographer Engine (Upload rights)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl shadow-md hover:opacity-95 transition mt-2"
          >
            {loading ? 'Registering Entry Protocol...' : 'Register Securely 🔐'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-700/60 pt-4">
          <p className="text-xs text-slate-400">
            Pehle se account hai?{' '}
            <Link to="/" className="text-cyan-400 font-semibold hover:underline">
              Log In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// 🗺️ 3. ROUTER HUB ENTRY POINT
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/event/:id" element={<EventGallery />} />
      </Routes>
    </Router>
  );
}

export default App;