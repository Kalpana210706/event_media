import { useState, useRef } from 'react';
import axios from 'axios';

function MediaUploadContainer({ eventId, onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  // 1. Core Handler: Files selection aur previews pipeline matrix generation
  const processFiles = (files) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length === 0) return;

    // State me append karna bulk selection maintain karne ke liye
    setSelectedFiles(prev => [...prev, ...validFiles]);

    // 👁️ LIVE MEDIA PREVIEW SYSTEM
    const newPreviews = validFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      url: URL.createObjectURL(file) // Memory buffer link generation
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
  };

  // 2. Drag and Drop Interaction Event Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Manual fallback selection controller
  const handleManualChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  // Selection queue me se object remove karne ka setup
  const removeFileFromQueue = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    // Memory leak segment clean up ke liye buffer target release karna
    URL.revokeObjectURL(previews[index].url);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // 3. 🚀 BULK UPLOAD EXECUTION ENGINE (Axios multipart protocol)
  const handleBulkUploadSubmit = async () => {
    if (selectedFiles.length === 0) return alert("Pehle upload karne ke liye media files choose karein!");

    setUploading(true);
    setProgress(10);

    const formData = new FormData();
    // Problem matrix metadata specification link bind
    formData.append("eventId", eventId);

    // Dynamic looping for Multi-Part storage transmission array
    selectedFiles.forEach((file) => {
      formData.append("mediaFiles", file); // Multi-upload array target keys mapping
    });

    try {
      const token = localStorage.getItem('token');
      
      // Axios request with progress bar hooks
      const response = await axios.post('https://event-media-1.onrender.com/api/media/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted > 10 ? percentCompleted : 10);
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert("🎉 Saara media cluster backend target repository par upload ho gaya!");
        // State flush out cleanup process loop
        previews.forEach(p => URL.revokeObjectURL(p.url));
        setSelectedFiles([]);
        setPreviews([]);
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (err) {
      console.error("Bulk upload processing anomaly detected:", err);
      alert("Database node injection rejection: Frontend processing check failed or token invalid.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl shadow-xl w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-200">🗂️ Advanced Core Media Engine</h3>
        <p className="text-xs text-slate-400">Drag and drop engine supporting massive parallel binary data array uploads.</p>
      </div>

      {/* 📥 DRAG & DROP ZONE */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[180px] ${
          dragActive 
            ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400' 
            : 'border-slate-700 bg-slate-950/40 hover:border-slate-500 text-slate-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleManualChange}
          className="hidden"
        />
        
        <span className="text-4xl mb-3 animate-bounce">📤</span>
        <p className="text-sm font-semibold text-slate-200">
          Drag & Drop your media cluster here or <span className="text-cyan-400 underline">Browse Local Directory</span>
        </p>
        <p className="text-[11px] text-slate-500 mt-1">Accepts multiple images/videos simultaneously</p>
      </div>

      {/* 👁️ CRITERIA CHECK: LIVE BULK PREVIEW SYSTEM GRID */}
      {previews.length > 0 && (
        <div className="mt-6 border-t border-slate-700/50 pt-5">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Media Previews Node Stack ({previews.length} Files Queued)
            </h4>
            <button 
              onClick={() => { setSelectedFiles([]); setPreviews([]); }}
              className="text-[11px] text-red-400 hover:underline font-medium"
              disabled={uploading}
            >
              Clear Buffer Queue
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[320px] overflow-y-auto p-2 bg-slate-950/50 border border-slate-800 rounded-xl">
            {previews.map((preview, index) => (
              <div key={index} className="relative group bg-slate-900 border border-slate-800 rounded-xl p-1.5 overflow-hidden flex flex-col justify-between">
                
                {/* Media Component Router (Img or Video frame selector) */}
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-black flex items-center justify-center">
                  {preview.type.startsWith('video/') ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 text-xs text-cyan-400 font-bold">
                      🎬 MP4 Node
                    </div>
                  ) : (
                    <img 
                      src={preview.url} 
                      alt="Local buffer cluster source" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="mt-1.5 text-[10px] text-slate-400 truncate px-1">
                  <p className="font-medium text-slate-300 truncate">{preview.name}</p>
                  <p className="text-slate-500">{preview.size}</p>
                </div>

                {/* Individual Object Cancellation Trigger */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFileFromQueue(index); }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center opacity-90 hover:opacity-100 shadow"
                  disabled={uploading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Progress Processing Console Bar Hook */}
          {uploading && (
            <div className="mt-4 bg-slate-950 border border-slate-800 p-3 rounded-xl">
              <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                <span>Uploading payload chunk streams...</span>
                <span className="text-cyan-400 font-mono">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Trigger Node Control Button */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleBulkUploadSubmit}
              disabled={uploading}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold text-xs rounded-xl transition shadow-md disabled:opacity-50"
            >
              {uploading ? 'Writing Stream Payload to AWS S3 Node...' : '🚀 Push Bulk Pipeline Content Live'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaUploadContainer;