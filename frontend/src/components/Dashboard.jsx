
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', category: 'CULTURAL_FEST' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  MULTI-CRITERIA EVENT SORTING & FILTERING STATES
  const [sortBy, setSortBy] = useState('date-desc'); // Options: date-desc, date-asc, name-asc, name-desc, category-asc
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // Category selection filter

  const userRole = localStorage.getItem('userRole') || 'MEMBER';
  const token = localStorage.getItem('token');

  // Fetch all campus events from backend
  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events'); 
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setEvents([
          { id: '9696a525-fcc6-43c7-8a8b-3f76b9307425', name: 'Annual Cultural Fest 2026', description: 'The flagship cultural event containing dances, concerts, and stalls.', category: 'CULTURAL_FEST', createdAt: '2026-05-31' }
        ]);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([
        { id: '9696a525-fcc6-43c7-8a8b-3f76b9307425', name: 'Annual Cultural Fest 2026', description: 'The flagship cultural event containing dances, concerts, and stalls.', category: 'CULTURAL_FEST', createdAt: '2026-05-31' }
      ]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.name.trim()) return alert("Event name is mandatory!");
    
    if (userRole !== 'ADMIN' && userRole !== 'PHOTOGRAPHER') {
      alert("❌ Unauthorized Action: Naye members ko campus event generate karne ki permission nahi hai!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newEvent.name,
          description: newEvent.description,
          category: newEvent.category
        })
      });

      if (res.ok) {
        setNewEvent({ name: '', description: '', category: 'CULTURAL_FEST' });
        setShowCreateForm(false);
        fetchEvents(); 
      } else {
        alert("Authorization failed or database rejected insertion.");
      }
    } catch (err) {
      console.error("Failed creating event:", err);
      alert("Network bypass active: Frontend validated.");
    } finally {
      setLoading(false);
    }
  };

  //  CORE RENDERING PIPELINE: SEARCH, FILTER & MULTI-CRITERIA EVENT SORTING ENGINE
  const getProcessedEvents = () => {
    // Step 1: Text search aur category selection ke bases par elements ko filter out karna
    const filtered = events.filter(event => {
      const matchesSearch = 
        event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = 
        selectedCategory === '' || 
        event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Step 2: Sorting matrix logic execute karna (Event Name, Date, and Category)
    return [...filtered].sort((alpha, beta) => {
      switch (sortBy) {
        case 'name-asc':
          return (alpha.name || '').localeCompare(beta.name || '');
        case 'name-desc':
          return (beta.name || '').localeCompare(alpha.name || '');
        case 'category-asc':
          return (alpha.category || '').localeCompare(beta.category || '');
        case 'date-asc':
          return new Date(alpha.createdAt || 0) - new Date(beta.createdAt || 0);
        case 'date-desc':
        default:
          return new Date(beta.createdAt || 0) - new Date(alpha.createdAt || 0);
      }
    });
  };

  const processedEvents = getProcessedEvents();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP STATUS BAR */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Event Hub Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">Logged in as: <span className="text-cyan-400 font-bold uppercase">{userRole}</span></p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 text-slate-300 font-medium rounded-xl text-sm border border-slate-700 transition"
          >
            Logout Securely
          </button>
        </div>

        {/* METRICS & COMMAND SYSTEM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
            <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Total Tracked Events</p>
            <h3 className="text-3xl font-black text-cyan-400 mt-1">{processedEvents.length}</h3>
          </div>
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
            <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Storage Node Connection</p>
            <h3 className="text-sm font-bold text-emerald-400 mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active / Local Pool
            </h3>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md flex items-center">
            {(userRole === 'ADMIN' || userRole === 'PHOTOGRAPHER') ? (
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="w-full h-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl font-medium transition text-sm flex items-center justify-center gap-2"
              >
                ➕ {showCreateForm ? 'Close Engine Panel' : 'Deploy New Campus Event'}
              </button>
            ) : (
              <div className="text-center w-full py-3 text-xs text-slate-500 italic bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                🔒 Content Explorer Mode Active
              </div>
            )}
          </div>
        </div>

        {/* NEW: SORTING AND CONTROLS MANAGEMENT CONSOLE */}
        <div className="bg-slate-800/90 border border-slate-700/60 p-5 rounded-2xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Text Search Input */}
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Search Keyword</label>
            <input 
              type="text"
              placeholder="Search by name or content text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder-slate-600"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Filter Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="">🎯 All Categories</option>
              <option value="CULTURAL_FEST">Cultural Fest</option>
              <option value="SPORTS_MEET">Sports Meet</option>
              <option value="TECH_CON">Technical Conference</option>
            </select>
          </div>

          {/* Core Sorting System Matrix Dropdown */}
          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Sort Order Matrix</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-500/30 text-cyan-400 font-medium rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="date-desc">📅 Date: Newest First</option>
              <option value="date-asc">📅 Date: Oldest First</option>
              <option value="name-asc">🔤 Event Name: A to Z</option>
              <option value="name-desc">🔤 Event Name: Z to A</option>
              <option value="category-asc">🏷️ Cluster Category Wise</option>
            </select>
          </div>
        </div>

        {/* LIVE INJECTOR FORM */}
        {showCreateForm && (userRole === 'ADMIN' || userRole === 'PHOTOGRAPHER') && (
          <form onSubmit={handleCreateEvent} className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl mb-8 space-y-4 max-w-xl animate-fadeIn">
            <h3 className="text-base font-bold text-slate-200">Initialize Event Entry Node</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Event/Fest Title</label>
                <input 
                  type="text" 
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  placeholder="e.g., Hackathon 2026"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-medium">Categorization Node</label>
                <select 
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="CULTURAL_FEST">Cultural Fest</option>
                  <option value="SPORTS_MEET">Sports Meet</option>
                  <option value="TECH_CON">Technical Conference</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Description Abstract</label>
              <textarea 
                rows="2"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Brief details about the highlights of this gathering..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl text-xs hover:opacity-90 transition shadow-md"
            >
              {loading ? 'Writing to Schema...' : 'Broadcast Node Live'}
            </button>
          </form>
        )}

        {/* ACTIVE CAMPUS EVENTS STREAM */}
        <h2 className="text-xl font-bold mb-4 text-slate-200 flex items-center gap-2">
          📁 Active Campus Clusters
        </h2>
        
        {processedEvents.length === 0 ? (
          <div className="text-center p-12 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700 text-slate-500 text-sm italic">
            No events found matching your filter/sorting rules.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedEvents.map((event) => (
              <div 
                key={event.id || event._id} 
                className="bg-slate-800/80 rounded-2xl border border-slate-700/70 p-5 flex flex-col justify-between shadow-lg hover:border-slate-500 transition group"
              >
                <div>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-md border border-cyan-500/20 uppercase tracking-wider mb-3">
                    {event.category || 'CAMPUS HUB'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition">{event.name}</h3>
                  <p className="text-slate-400 text-xs mt-1.5 line-clamp-3 leading-relaxed">{event.description}</p>
                </div>
                
                <div className="mt-5 pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
                  <span>{event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'Recent'}</span>
                  <Link 
                    to={`/event/${event.id || event._id}`} 
                    className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1"
                  >
                    View Media &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;