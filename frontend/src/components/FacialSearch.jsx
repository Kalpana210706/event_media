import { useState } from 'react';
import axios from 'axios';

const FacialSearch = ({ eventId }) => {
    const [selfie, setSelfie] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [matchedPhotos, setMatchedPhotos] = useState([]);
    const [message, setMessage] = useState('');
    const [confidence, setConfidence] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelfie(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!selfie) {
            alert("Please select or take a selfie first! 🤳");
            return;
        }

        setLoading(true);
        setMessage('');
        setMatchedPhotos([]);

        const formData = new FormData();
        formData.append('selfie', selfie);

        try {
            // Humare backend routing matrix call mapping
            const token = localStorage.getItem('token'); // Agar headers me JWT chahiye ho
            const response = await axios.post(`https://event-media-1.onrender.com/api/media/event/${eventId}/find-me`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token ? `Bearer ${token}` : ''
                }
            });

            setMessage(response.data.message);
            setConfidence(response.data.matchConfidence);
            setMatchedPhotos(response.data.matchedPhotos || []);
        } catch (error) {
            console.error("AI Scanning operational failure:", error);
            alert(error.response?.data?.error || "Neural matrix scan broke down.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#111827', padding: '24px', borderRadius: '12px', marginTop: '24px', color: '#fff' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#38bdf8', fontWeight: 'bold' }}>
                🧠 AI Personalized Photo Discovery (Find Me)
            </h2>
            <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
                Upload your reference selfie to instantly pull all matching gallery photos containing your face!
            </p>

            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                <div style={{ border: '2px dashed #374151', padding: '20px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                        id="selfie-upload" 
                    />
                    <label htmlFor="selfie-upload" style={{ cursor: 'pointer', display: 'block' }}>
                        {preview ? (
                            <img src={preview} alt="Selfie Preview" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto' }} />
                        ) : (
                            <div style={{ fontSize: '2.5rem' }}>🤳</div>
                        )}
                        <span style={{ display: 'block', marginTop: '8px', color: '#9ca3af' }}>
                            {selfie ? selfie.name : 'Click to select reference selfie'}
                        </span>
                    </label>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        background: loading ? '#4b5563' : '#2563eb',
                        color: '#fff',
                        padding: '12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: '0.3s'
                    }}
                >
                    {loading ? '🧠 Neural Engines Scanning Core Frames...' : 'Search My Photos 🎯'}
                </button>
            </form>

            {/* Results Feedback Message Layer */}
            {message && (
                <div style={{ marginTop: '20px', background: '#1f2937', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#10b981' }}>{message}</p>
                    {confidence && <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af' }}>Confidence Index Matrix: {confidence}</p>}
                </div>
            )}

            {/* Matched Gallery View */}
            <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: '#f3f4f6' }}>
                    Your Personalized Snaps ({matchedPhotos.length})
                </h3>

                {matchedPhotos.length === 0 && !loading && message && (
                    <p style={{ color: '#6b7280' }}>No matching image tracks returned for this event context.</p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                    {matchedPhotos.map((photo) => (
                        <div key={photo.id} style={{ background: '#1f2937', borderRadius: '8px', overflow: 'hidden', border: '1px solid #374151' }}>
                            <img 
                                src={`https://event-media-1.onrender.com${photo.url}`} 
                                alt="Matched Snap" 
                                style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
                            />
                            <div style={{ padding: '8px' }}>
                                <span style={{ fontSize: '0.75rem', background: '#374151', padding: '2px 6px', borderRadius: '4px' }}>
                                    AI Verified
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FacialSearch;