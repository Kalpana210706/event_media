import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER' // Default role standard attendees ke liye
  });
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
        alert('🚀 Account Created Successfully! Please login now.');
        navigate('/login'); // Naya account bante hi direct login page par transfer
      } else {
        setError(data.error || 'Registration failed. Try again.');
      }
    } catch (err) {
      setError('Server context connection failed.');
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
        <p className="text-xs text-slate-400 text-center mb-6">Join Eventify AI to secure your digital presence.</p>

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
              placeholder="Enter your name"
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
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
            >
              <option value="MEMBER">Standard Attendee / Member</option>
              <option value="PHOTOGRAPHER">Event Photographer</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-xl shadow-md hover:opacity-95 transition mt-2"
          >
            {loading ? 'Creating Matrix Link...' : 'Register Securely 🔐'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-700/60 pt-4">
          <p className="text-xs text-slate-400">
            Pehle se account hai?{' '}
            <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
              Log In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;