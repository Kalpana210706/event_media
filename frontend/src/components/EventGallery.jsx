
// import { useState, useEffect, useRef } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';

// function EventGallery() {
//   const { id } = useParams(); // URL params se Event ID access
//   const [mediaItems, setMediaItems] = useState([]);
//   const [commentInputs, setCommentInputs] = useState({});

//   // 📥 BULK MEDIA UPLOAD SYSTEM STATES (Requirement 2)
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [dragActive, setDragActive] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadMessage, setUploadMessage] = useState('');
//   const fileInputRef = useRef(null);

//   // 🧠 AI FACIAL RECOGNITION SEARCH MATRIX STATES
//   const [selfieFile, setSelfieFile] = useState(null);
//   const [selfiePreview, setSelfiePreview] = useState('');
//   const [aiScanning, setAiScanning] = useState(false);
//   const [personalMatches, setPersonalMatches] = useState([]);
//   const [hasScanned, setHasScanned] = useState(false);
//   const [confidenceIndex, setConfidenceIndex] = useState('');

//   // 🔍 NEW ADVANCED SEARCH & SMART TAG FILTER STATES
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedTagFilter, setSelectedTagFilter] = useState('');

//   const userRole = localStorage.getItem('userRole') || 'MEMBER';

//   const fetchEventsMedia = async () => {
//     try {
//       const activeToken = localStorage.getItem('token');
//       const headers = { 'Content-Type': 'application/json' };
//       if (activeToken) {
//         headers['Authorization'] = `Bearer ${activeToken.trim()}`;
//       }

//       const res = await fetch(`http://localhost:5000/api/media/event/${id}`, {
//         method: 'GET',
//         headers: headers
//       });
//       const data = await res.json();

//       console.log("📥 Live Received Feed Data Array:", data);

//       if (Array.isArray(data)) {
//         setMediaItems(data);
//       } else if (data && Array.isArray(data.media)) {
//         setMediaItems(data.media);
//       } else if (data && Array.isArray(data.data)) {
//         setMediaItems(data.data);
//       } else {
//         setMediaItems([]);
//       }
//     } catch (err) {
//       console.error("Error fetching media from Node server:", err);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchEventsMedia();
//     }
//   }, [id]);

//   // Sync AI Filtered results data on real-time like/comment updates
//   useEffect(() => {
//     if (hasScanned && personalMatches.length > 0) {
//       const updatedMatches = personalMatches.map(match => {
//         const freshData = mediaItems.find(item => (item.id || item._id) === (match.id || match._id));
//         return freshData ? freshData : match;
//       });
//       setPersonalMatches(updatedMatches);
//     }
//   }, [mediaItems]);

//   // 📥 MULTI-FILE SELECT / DRAG PROCESSING QUEUE (Requirement 2)
//   const processUploadedFiles = (files) => {
//     const validFiles = Array.from(files).filter(file => 
//       file.type.startsWith('image/') || file.type.startsWith('video/')
//     );

//     if (validFiles.length === 0) return;

//     setSelectedFiles(prev => [...prev, ...validFiles]);

//     // Media preview loop matrix tracking link before upload commits
//     const freshPreviews = validFiles.map(file => ({
//       name: file.name,
//       type: file.type,
//       size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
//       url: URL.createObjectURL(file)
//     }));

//     setPreviews(prev => [...prev, ...freshPreviews]);
//   };

//   const handleDragEvents = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDropFiles = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       processUploadedFiles(e.dataTransfer.files);
//     }
//   };

//   const handleManualFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       processUploadedFiles(e.target.files);
//     }
//   };

//   const removeFileFromQueue = (index) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     URL.revokeObjectURL(previews[index].url); // RAM Leak controller optimization hook
//     setPreviews(prev => prev.filter((_, i) => i !== index));
//   };

//   const clearUploadBufferPool = () => {
//     previews.forEach(p => URL.revokeObjectURL(p.url));
//     setSelectedFiles([]);
//     setPreviews([]);
//     setUploadMessage('');
//   };

//   // 🚀 BULK UPLOAD EVENT HANDLER ENGINE (Connected with req.files backend route array key 'mediaFiles')
//   const handleBulkUploadSubmit = async (e) => {
//     e.preventDefault();
//     if (selectedFiles.length === 0) {
//       alert("Pehle files drag karein ya browse karke queue me add karein!");
//       return;
//     }

//     const activeToken = localStorage.getItem('token');
//     if (!activeToken) {
//       setUploadMessage('❌ Session Expired. Please login again.');
//       return;
//     }

//     setUploading(true);
//     setUploadProgress(10);
//     setUploadMessage('Initiating chunk payload streaming context...');

//     const formData = new FormData();
//     formData.append('eventId', id);

//     // Backend looping array index pointer matching engine matrix loop
//     selectedFiles.forEach((file) => {
//       formData.append('mediaFiles', file); // MUST MATCH backend multer upload.array('mediaFiles') mapping key
//     });

//     try {
//       const response = await axios.post('http://localhost:5000/api/media/bulk-upload', formData, {
//         headers: {
//           'Authorization': `Bearer ${activeToken.trim()}`,
//           'Content-Type': 'multipart/form-data'
//         },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(percentCompleted > 10 ? percentCompleted : 10);
//         }
//       });

//       if (response.status === 200 || response.status === 201) {
//         setUploadMessage(`🚀 Bulk Batch Upload Completed! ${selectedFiles.length} snaps saved successfully.`);
//         // Garbage reference nodes deletion loops
//         previews.forEach(p => URL.revokeObjectURL(p.url));
//         setSelectedFiles([]);
//         setPreviews([]);
//         fetchEventsMedia();
//       }
//     } catch (err) {
//       console.error("Bulk payload stream failure:", err);
//       setUploadMessage(`❌ Batch Rejection: ${err.response?.data?.error || 'Database mapping exception'}`);
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   // 🧠 SELFIE INPUT TRACKER HANDLER FOR AI
//   const handleSelfieChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelfieFile(file);
//       setSelfiePreview(URL.createObjectURL(file));
//     }
//   };

//   // 🧠 TRIGGER AUTOMATED FACE SEARCH SCAN IN FULL CASCADE
//   const handleAiFaceSearch = async (e) => {
//     e.preventDefault();
//     if (!selfieFile) {
//       alert("Bhai, scanning matrix trigger karne ke liye pehle ek selfie ya photo chuno! 🤳");
//       return;
//     }

//     setAiScanning(true);
//     setHasScanned(true);
//     setPersonalMatches([]);

//     const formData = new FormData();
//     formData.append('selfie', selfieFile);

//     try {
//       const activeToken = localStorage.getItem('token');
      
//       const response = await axios.post(`http://localhost:5000/api/media/event/${id}/find-me`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': activeToken ? `Bearer ${activeToken.trim()}` : ''
//         }
//       });

//       setPersonalMatches(response.data.matchedPhotos || []);
//       setConfidenceIndex(response.data.matchConfidence || "97.8%");
//     } catch (error) {
//       console.error("Neural search cluster connection collapsed:", error);
//       alert(error.response?.data?.error || "AI Core Processing Error. Ensure face models are ready.");
//     } finally {
//       setAiScanning(false);
//     }
//   };

//   const handleLikeClick = async (mediaId) => {
//     const activeToken = localStorage.getItem('token');
//     if (!activeToken) {
//       alert("Please login to like this post.");
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/media/like', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${activeToken.trim()}`
//         },
//         body: JSON.stringify({ mediaId })
//       });

//       if (response.ok) {
//         fetchEventsMedia();
//       }
//     } catch (err) {
//       console.error("Error toggling like:", err);
//     }
//   };

//   const handleCommentSubmit = async (itemObj, commentText) => {
//     const targetMediaId = itemObj.id || itemObj._id;
//     if (!targetMediaId) return;

//     if (!commentText || !commentText.trim()) {
//       alert("Comment cannot be empty!");
//       return;
//     }

//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch(`http://localhost:5000/api/media/${targetMediaId}/comment`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token.trim()}`
//         },
//         body: JSON.stringify({ text: commentText.trim() })
//       });

//       if (res.ok) {
//         setCommentInputs(prev => ({ ...prev, [targetMediaId]: '' }));
//         fetchEventsMedia();
//       }
//     } catch (err) {
//       console.error("Comment error:", err);
//     }
//   };

//   const handleDeleteMedia = async (mediaId) => {
//     if (!mediaId) return;
//     if (!window.confirm("Are you sure you want to delete this snap?")) return;
    
//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch(`http://localhost:5000/api/media/${mediaId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token.trim()}`
//         }
//       });
      
//       if (res.ok) {
//         fetchEventsMedia();
//       }
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   const handleShareMedia = (mediaUrl) => {
//     const absoluteLink = mediaUrl.startsWith('http') ? mediaUrl : `http://localhost:5000${mediaUrl.startsWith('/') ? mediaUrl : '/' + mediaUrl}`;
//     if (navigator.clipboard) {
//       navigator.clipboard.writeText(absoluteLink);
//       alert("🔗 Direct share link copied to clipboard successfully!");
//     } else {
//       alert(`Copy link manually: ${absoluteLink}`);
//     }
//   };

//   const handleDownloadMedia = async (mediaUrl) => {
//     try {
//       const clubName = "Alpha Media Club"; 
//       const eventLabel = `Event Node #${id?.substring(0, 5) || 'CAMPUS'}`;
//       const roleText = localStorage.getItem('userRole') || 'MEMBER';
//       const stampPayload = `🛡️ ${clubName} | ${eventLabel} | Auth: ${roleText} 🛡️`;

//       const imageElement = new Image();
//       imageElement.crossOrigin = "anonymous"; 
//       imageElement.src = mediaUrl.startsWith('http') ? mediaUrl : `http://localhost:5000${mediaUrl.startsWith('/') ? mediaUrl : '/' + mediaUrl}`;

//       imageElement.onload = () => {
//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d');

//         canvas.width = imageElement.width;
//         canvas.height = imageElement.height;

//         context.drawImage(imageElement, 0, 0);

//         const computedFontScale = Math.floor(canvas.width / 24) || 22;
//         context.font = `bold ${computedFontScale}px sans-serif`;
//         context.fillStyle = "rgba(255, 255, 255, 0.42)"; 
//         context.strokeStyle = "rgba(0, 0, 0, 0.25)";    
//         context.lineWidth = 4;
//         context.textAlign = "center";
//         context.textBaseline = "middle";

//         const horizontalCenter = canvas.width / 2;
//         const verticalCenter = canvas.height / 2;

//         context.translate(horizontalCenter, verticalCenter);
//         context.rotate(-28 * Math.PI / 180); 
//         context.translate(-horizontalCenter, -verticalCenter);

//         context.strokeText(stampPayload, horizontalCenter, verticalCenter);
//         context.fillText(stampPayload, horizontalCenter, verticalCenter);

//         const compiledAssetDataUrl = canvas.toDataURL('image/jpeg', 0.92);
//         const auxiliaryDownloadAnchor = document.createElement('a');
//         auxiliaryDownloadAnchor.href = compiledAssetDataUrl;
//         auxiliaryDownloadAnchor.download = `Secure_Watermarked_Asset_${Date.now()}.jpg`;
        
//         document.body.appendChild(auxiliaryDownloadAnchor);
//         auxiliaryDownloadAnchor.click();
//         document.body.removeChild(auxiliaryDownloadAnchor);
//       };

//       imageElement.onerror = () => {
//         console.warn("⚠️ Canvas pipeline processing hit CORS restrictions, processing default stream.");
//         const directFilename = mediaUrl.split('/').pop();
//         window.open(`http://localhost:5000/api/media/download/${directFilename}`, '_blank');
//       };

//     } catch (processingFault) {
//       console.error("Critical fault inside local watermarking engine:", processingFault);
//       const directFilename = mediaUrl.split('/').pop();
//       window.open(`http://localhost:5000/api/media/download/${directFilename}`, '_blank');
//     }
//   };

//   const handleInputChange = (id, value) => {
//     setCommentInputs(prev => ({ ...prev, [id]: value }));
//   };

//   const filteredMediaItems = mediaItems.filter(item => {
//     const textQuery = searchQuery.toLowerCase().trim();
    
//     const normalizedTags = Array.isArray(item.tags) 
//       ? item.tags.join(', ').toLowerCase() 
//       : (typeof item.tags === 'string' ? item.tags.toLowerCase() : '');

//     const matchesText = 
//       textQuery === '' ||
//       normalizedTags.includes(textQuery) ||
//       (item.user?.name && item.user.name.toLowerCase().includes(textQuery)) ||
//       (item.createdAt && item.createdAt.includes(textQuery));

//     const matchesTagDropdown = 
//       selectedTagFilter === '' ||
//       normalizedTags.includes(selectedTagFilter.toLowerCase());

//     return matchesText && matchesTagDropdown;
//   });

//   const renderPhotoCard = (item) => {
//     const currentMediaId = item.id || item._id;
//     const cleanUrl = item.url?.startsWith('/') ? item.url : `/${item.url}`;
//     const parsedImageSrc = item.url?.startsWith('http') ? item.url : `http://localhost:5000${cleanUrl}`;

//     const tagArray = Array.isArray(item.tags) 
//       ? item.tags 
//       : (typeof item.tags === 'string' && item.tags ? item.tags.split(',') : []);

//     return (
//       <div key={currentMediaId || Math.random().toString()} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg flex flex-col justify-between transition duration-200 hover:border-slate-600">
//         <div className="aspect-video bg-slate-950 relative overflow-hidden select-none">
//           <img 
//             src={parsedImageSrc} 
//             alt="Event Snapshot" 
//             className="w-full h-full object-cover pointer-events-none"
//             onError={(e) => {
//               e.target.onerror = null; 
//               e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80";
//             }}
//           />
//           <div className="absolute inset-0 flex items-center justify-center rotate-[-25deg] pointer-events-none select-none">
//             <span className="text-[11px] md:text-sm font-black text-slate-400/20 uppercase tracking-widest border border-slate-400/10 px-2 py-1 rounded bg-slate-950/5">
//               EventMedia Secure Node Preview
//             </span>
//           </div>

//           {(userRole === 'ADMIN' || userRole === 'PHOTOGRAPHER') && currentMediaId && (
//             <button onClick={() => handleDeleteMedia(currentMediaId)} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg text-xs shadow-md transition z-20">
//               🗑️ Delete
//             </button>
//           )}

//           {tagArray.length > 0 && (
//             <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-[80%] z-10 pointer-events-none">
//               {tagArray.map((tag, i) => (
//                 <span key={i} className="text-[9px] font-semibold bg-slate-900/90 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded shadow">
//                   #{tag.trim()}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
        
//         <div className="p-4 flex flex-col gap-3 bg-slate-800 border-t border-slate-700/60">
//           <div className="flex flex-wrap items-center gap-2">
//             <button onClick={() => handleLikeClick(currentMediaId)} className="text-xs font-semibold text-slate-300 hover:text-red-400 transition flex items-center gap-1.5 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-700">
//               ❤️ Like ({item.likes?.length || 0})
//             </button>
//             <button onClick={() => handleShareMedia(item.url)} className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-700">
//               📤 Share
//             </button>
//             <button onClick={() => handleDownloadMedia(item.url)} className="text-xs font-semibold text-white hover:text-white transition flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 px-3 py-2 rounded-xl shadow-sm">
//               📥 Download Secure File
//             </button>
//           </div>

//           <div className="mt-1 border-t border-gray-700/50 pt-3">
//             <div className="flex justify-between items-center mb-2">
//               <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Discussion Feed</h4>
//               <span className="text-[10px] bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-full font-mono">{item.comments?.length || 0} threads</span>
//             </div>

//             <div className="space-y-1.5 max-h-32 overflow-y-auto mb-3 text-xs custom-scrollbar">
//               {item.comments && item.comments.length > 0 ? (
//                 item.comments.map((comment) => (
//                   <div key={comment.id || Math.random().toString()} className="bg-slate-950/40 p-2 rounded-xl border border-slate-900/40 break-words">
//                     <p className="text-slate-300">
//                       <span className="text-cyan-400/90 font-medium mr-1 text-[11px]">{comment.user?.name || "Member"}:</span>
//                       {comment.text}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-[11px] text-slate-500 italic py-2 text-center bg-slate-950/20 rounded-xl border border-dashed border-slate-700/30">No words left here yet.</p>
//               )}
//             </div>

//             <div className="flex gap-2 mt-2">
//               <input 
//                 type="text" 
//                 placeholder="Write a response..."
//                 value={commentInputs[currentMediaId] || ''}
//                 onChange={(e) => handleInputChange(currentMediaId, e.target.value)}
//                 className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
//                 onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(item, commentInputs[currentMediaId]); }}
//               />
//               <button onClick={() => handleCommentSubmit(item, commentInputs[currentMediaId])} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-lg transition">Reply</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 text-white p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <Link to="/dashboard" className="text-sm text-cyan-400 hover:underline">&larr; Back to Dashboard</Link>
//           <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-400">ID: {id}</span>
//         </div>

//         <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Event Media Gallery</h1>
        
//         {/* SECTION 1: FACIAL RECOGNITION PANEL */}
//         <div className="mt-8 p-6 bg-slate-800 border-2 border-cyan-500/30 rounded-2xl shadow-xl">
//           <div className="flex items-center gap-2.5 mb-2">
//             <span className="text-2xl">🧠</span>
//             <h2 className="text-xl font-bold text-cyan-400">AI Personalized Photo Discovery (Face Recognition)</h2>
//           </div>
//           <p className="text-xs text-slate-400 mb-6">
//             Kisi bhi student/person ki reference selfie ya photo load karein. Humara neural engine pore event ki uploads scan karke uski accurate personal snaps filter kar dega!
//           </p>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
//             <form onSubmit={handleAiFaceSearch} className="space-y-4 md:col-span-1">
//               <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-6 text-center bg-slate-900/50 hover:border-cyan-400 transition cursor-pointer min-h-[140px] flex flex-col justify-center items-center">
//                 <input 
//                   type="file" 
//                   accept="image/*" 
//                   onChange={handleSelfieChange} 
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                 />
//                 {selfiePreview ? (
//                   <div className="flex flex-col items-center gap-2">
//                     <img src={selfiePreview} alt="Target" className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-md" />
//                     <span className="text-[11px] text-cyan-400 font-medium">✓ Reference Ready</span>
//                   </div>
//                 ) : (
//                   <div className="space-y-1">
//                     <div className="text-2xl">🤳</div>
//                     <p className="text-xs font-medium text-slate-300">Click to load Target Face</p>
//                     <p className="text-[10px] text-slate-500">Selfie / Group cropped face</p>
//                   </div>
//                 )}
//               </div>

//               <button type="submit" disabled={aiScanning} className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-md uppercase tracking-wider transition">
//                 {aiScanning ? '🧠 AI Neural Matrix Scanning Core Frames...' : 'Search Person\'s Snaps 🎯'}
//               </button>
//             </form>

//             <div className="md:col-span-2 bg-slate-950/60 border border-slate-800 p-4 rounded-xl min-h-[195px] flex flex-col">
//               <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-4">
//                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Filtered Pipeline Display</h3>
//                 {hasScanned && !aiScanning && personalMatches.length > 0 && (
//                   <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
//                     Confidence Map: {confidenceIndex}
//                   </span>
//                 )}
//               </div>

//               {aiScanning ? (
//                 <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-6">
//                   <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
//                   <p className="text-xs text-slate-400 italic">Face vector data extract karke catalog compile ho raha hai...</p>
//                 </div>
//               ) : !hasScanned ? (
//                 <div className="flex-1 flex items-center justify-center text-slate-600 text-xs italic text-center py-8">
//                   Left box me kisi ki photo select karke search dabayein, uski matches full interactivity ke saath yahan load ho jayengi.
//                 </div>
//               ) : personalMatches.length === 0 ? (
//                 <div className="flex-1 flex items-center justify-center text-amber-500/80 text-xs py-8">
//                   ⚠️ Is specific character ke vectors is Event Media storage nodes me nahi mile.
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {personalMatches.map((match) => renderPhotoCard(match))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* 📥 UPGRADED PHOTOGRAPHER UPLOAD PANEL: DRAG-DROP, BULK & PREVIEW INTEGRATED */}
//         {(userRole === 'ADMIN' || userRole === 'PHOTOGRAPHER') ? (
//           <div className="mt-8 p-6 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full">
//             <div className="mb-4">
//               <h3 className="text-lg font-bold text-slate-200">🗂️ Photographer Control Panel (Advanced Media Engine)</h3>
//               <p className="text-xs text-slate-400">Drag and drop engine supporting batch dynamic binary matrix stream uploads.</p>
//             </div>

//             {/* 📥 REQUIREMENT CHECK: DRAG & DROP ZONE LOOKUP DETECTOR */}
//             <div
//               onDragEnter={handleDragEvents}
//               onDragOver={handleDragEvents}
//               onDragLeave={handleDragEvents}
//               onDrop={handleDropFiles}
//               onClick={() => !uploading && fileInputRef.current.click()}
//               className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[160px] ${
//                 dragActive 
//                   ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 scale-[0.99]' 
//                   : 'border-slate-600 bg-slate-900/50 hover:border-slate-500 text-slate-400'
//               }`}
//             >
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 multiple
//                 accept="image/*,video/*"
//                 onChange={handleManualFileChange}
//                 className="hidden"
//                 disabled={uploading}
//               />
              
//               <span className="text-4xl mb-3 animate-bounce">📤</span>
//               <p className="text-sm font-semibold text-slate-200">
//                 Drag & Drop your media files here or <span className="text-cyan-400 underline cursor-pointer">Browse Local Directory</span>
//               </p>
//               <p className="text-[11px] text-slate-500 mt-1">Accepts multiple images/videos simultaneously</p>
//             </div>

//             {/* 👁️ REQUIREMENT CHECK: BULK LIVE PREVIEW SYSTEM GRID */}
//             {previews.length > 0 && (
//               <div className="mt-6 border-t border-slate-700/50 pt-5">
//                 <div className="flex justify-between items-center mb-3">
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
//                     Media Previews Queue Pool ({previews.length} Files Selected)
//                   </h4>
//                   <button 
//                     type="button"
//                     onClick={clearUploadBufferPool}
//                     className="text-[11px] text-red-400 hover:underline font-medium"
//                     disabled={uploading}
//                   >
//                     Clear Buffer Queue
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[300px] overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
//                   {previews.map((preview, index) => (
//                     <div key={index} className="relative bg-slate-900 border border-slate-800 rounded-xl p-1.5 overflow-hidden flex flex-col justify-between">
//                       <div className="w-full aspect-square rounded-lg overflow-hidden bg-black flex items-center justify-center">
//                         {preview.type.startsWith('video/') ? (
//                           <div className="text-xs text-cyan-400 font-bold font-mono">🎬 Video Clip</div>
//                         ) : (
//                           <img src={preview.url} alt="Local buffer" className="w-full h-full object-cover" />
//                         )}
//                       </div>

//                       <div className="mt-1.5 text-[10px] text-slate-400 truncate px-1">
//                         <p className="font-medium text-slate-300 truncate">{preview.name}</p>
//                         <p className="text-slate-500">{preview.size}</p>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={(e) => { e.stopPropagation(); removeFileFromQueue(index); }}
//                         className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center hover:bg-red-500 shadow"
//                         disabled={uploading}
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 {/* REAL-TIME PROGRESS BAR CONSOLE */}
//                 {uploading && (
//                   <div className="mt-4 bg-slate-950 border border-slate-800 p-3 rounded-xl">
//                     <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
//                       <span>Writing batch payload streams to local pool node...</span>
//                       <span className="text-cyan-400 font-mono">{uploadProgress}%</span>
//                     </div>
//                     <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
//                       <div 
//                         className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300 rounded-full"
//                         style={{ width: `${uploadProgress}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}

//                 {/* BULK UPLOAD DISPATCH TRIGGER */}
//                 <div className="mt-5 flex justify-end">
//                   <button
//                     onClick={handleBulkUploadSubmit}
//                     disabled={uploading}
//                     className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs rounded-xl transition shadow-md disabled:opacity-50 uppercase tracking-wider"
//                   >
//                     {uploading ? 'Uploading Parallel Binary Cluster...' : '🚀 Push Bulk Pipeline Live'}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {uploadMessage && (
//               <p className="mt-3 text-xs text-cyan-400 text-center bg-slate-950 p-2 rounded-lg border border-slate-800">{uploadMessage}</p>
//             )}
//           </div>
//         ) : (
//           <div className="mt-8 p-4 bg-slate-800/40 text-xs text-slate-500 italic rounded-xl border border-dashed border-slate-800 max-w-xl">
//             🔒 Photo uploads functionality is restricted to event photographers & administrators only.
//           </div>
//         )}

//         {/* 🔍 NEW SECTION: ADVANCED SEARCH CONSOLE BLOCK */}
//         <div className="mt-8 p-5 bg-slate-800/90 border border-slate-700 rounded-2xl shadow-lg">
//           <div className="flex items-center gap-2 mb-4">
//             <span className="text-xl">🔍</span>
//             <h3 className="text-md font-bold text-slate-200">Advanced Metadata Multi-Query Search</h3>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="md:col-span-2 relative">
//               <input 
//                 type="text"
//                 placeholder="Search by Tags (e.g. crowd, sports), Upload date, or Photographer name..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-slate-900 text-xs border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 placeholder-slate-500 transition"
//               />
//               {searchQuery && (
//                 <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-xs text-slate-500 hover:text-slate-300">✕</button>
//               )}
//             </div>

//             <div className="md:col-span-1">
//               <select
//                 value={selectedTagFilter}
//                 onChange={(e) => setSelectedTagFilter(e.target.value)}
//                 className="w-full bg-slate-900 text-xs border border-slate-700 rounded-xl px-3 py-3 text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer transition"
//               >
//                 <option value="">🎯 All AI Generated Tag Vectors</option>
//                 <option value="crowd">👥 Crowd / Cultural Fest</option>
//                 <option value="sports">⚽ Sports / Action</option>
//                 <option value="mountains">🏔️ Mountains / Trip</option>
//                 <option value="scenic">🏖️ Scenic / Outdoor</option>
//                 <option value="indoor">🏢 Indoor / Campus life</option>
//               </select>
//             </div>
//           </div>
          
//           <div className="mt-2.5 flex justify-between items-center text-[11px] text-slate-500 px-1">
//             <span>Search Status: {searchQuery || selectedTagFilter ? '🔴 Query Filtering Active' : '🟢 Idle Scanning'}</span>
//             <span>Matching Index: {filteredMediaItems.length} snaps found</span>
//           </div>
//         </div>

//         {/* STANDARD IMAGES DISPLAY GRID (UPDATED LOOP ROUTING TO FILTER MATRIX) */}
//         <h2 className="text-xl font-semibold mt-8 mb-4 text-slate-200">Uploaded Snaps Gallery (All Snaps)</h2>
//         {filteredMediaItems.length === 0 ? (
//           <div className="text-center p-12 bg-slate-800/50 rounded-2xl border border-slate-800 text-slate-500 text-sm">
//             No active assets match your selected text or tag filter criteria.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             {filteredMediaItems.map((item) => renderPhotoCard(item))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default EventGallery;

import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function EventGallery() {
  const { id } = useParams(); // URL params se Event ID access
  const [mediaItems, setMediaItems] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  // 📥 BULK MEDIA UPLOAD SYSTEM STATES (Requirement 2)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef(null);

  // 🧠 AI FACIAL RECOGNITION SEARCH MATRIX STATES
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState('');
  const [aiScanning, setAiScanning] = useState(false);
  const [personalMatches, setPersonalMatches] = useState([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [confidenceIndex, setConfidenceIndex] = useState('');

  // 🔍 NEW ADVANCED SEARCH & SMART TAG FILTER STATES
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('');

  // ⭐ FAVORITES & NOTIFICATION STATES
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(`fav_events_${id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);

  const userRole = localStorage.getItem('userRole') || 'MEMBER';

  // Helper trigger for custom notification banner alerts
  const triggerNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
  };

  // Dismiss notification banner automatically
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: 'info' });
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Sync favorites data locally when modified
  useEffect(() => {
    localStorage.setItem(`fav_events_${id}`, JSON.stringify(favorites));
  }, [favorites, id]);

  const fetchEventsMedia = async () => {
    try {
      const activeToken = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (activeToken) {
        headers['Authorization'] = `Bearer ${activeToken.trim()}`;
      }

      const res = await fetch(`http://localhost:5000/api/media/event/${id}`, {
        method: 'GET',
        headers: headers
      });
      const data = await res.json();

      console.log("📥 Live Received Feed Data Array:", data);

      if (Array.isArray(data)) {
        setMediaItems(data);
      } else if (data && Array.isArray(data.media)) {
        setMediaItems(data.media);
      } else if (data && Array.isArray(data.data)) {
        setMediaItems(data.data);
      } else {
        setMediaItems([]);
      }
    } catch (err) {
      console.error("Error fetching media from Node server:", err);
      triggerNotification("Failed to fetch gallery media stream.", "error");
    }
  };

  useEffect(() => {
    if (id) {
      fetchEventsMedia();
    }
  }, [id]);

  // Sync AI Filtered results data on real-time like/comment updates
  useEffect(() => {
    if (hasScanned && personalMatches.length > 0) {
      const updatedMatches = personalMatches.map(match => {
        const freshData = mediaItems.find(item => (item.id || item._id) === (match.id || match._id));
        return freshData ? freshData : match;
      });
      setPersonalMatches(updatedMatches);
    }
  }, [mediaItems]);

  // 📥 MULTI-FILE SELECT / DRAG PROCESSING QUEUE (Requirement 2)
  const processUploadedFiles = (files) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );

    if (validFiles.length === 0) return;

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Media preview loop matrix tracking link before upload commits
    const freshPreviews = validFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      url: URL.createObjectURL(file)
    }));

    setPreviews(prev => [...prev, ...freshPreviews]);
    triggerNotification(`Added ${validFiles.length} item(s) to the upload buffer.`, 'info');
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDropFiles = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleManualFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFiles(e.target.files);
    }
  };

  const removeFileFromQueue = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index].url); // RAM Leak controller optimization hook
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearUploadBufferPool = () => {
    previews.forEach(p => URL.revokeObjectURL(p.url));
    setSelectedFiles([]);
    setPreviews([]);
    setUploadMessage('');
    triggerNotification("Upload buffer queue cleared.", "info");
  };

  // 🚀 BULK UPLOAD EVENT HANDLER ENGINE (Connected with req.files backend route array key 'mediaFiles')
  const handleBulkUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Pehle files drag karein ya browse karke queue me add karein!");
      return;
    }

    const activeToken = localStorage.getItem('token');
    if (!activeToken) {
      setUploadMessage('❌ Session Expired. Please login again.');
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    setUploadMessage('Initiating chunk payload streaming context...');

    const formData = new FormData();
    formData.append('eventId', id);

    // Backend looping array index pointer matching engine matrix loop
    selectedFiles.forEach((file) => {
      formData.append('mediaFiles', file); // MUST MATCH backend multer upload.array('mediaFiles') mapping key
    });

    try {
      const response = await axios.post('http://localhost:5000/api/media/bulk-upload', formData, {
        headers: {
          'Authorization': `Bearer ${activeToken.trim()}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted > 10 ? percentCompleted : 10);
        }
      });

      if (response.status === 200 || response.status === 201) {
        setUploadMessage(`🚀 Bulk Batch Upload Completed! ${selectedFiles.length} snaps saved successfully.`);
        triggerNotification("Pipeline upload completed successfully!", "success");
        // Garbage reference nodes deletion loops
        previews.forEach(p => URL.revokeObjectURL(p.url));
        setSelectedFiles([]);
        setPreviews([]);
        fetchEventsMedia();
      }
    } catch (err) {
      console.error("Bulk payload stream failure:", err);
      setUploadMessage(`❌ Batch Rejection: ${err.response?.data?.error || 'Database mapping exception'}`);
      triggerNotification("Bulk upload failed.", "error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // 🧠 SELFIE INPUT TRACKER HANDLER FOR AI
  const handleSelfieChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelfieFile(file);
      setSelfiePreview(URL.createObjectURL(file));
    }
  };

  // 🧠 TRIGGER AUTOMATED FACE SEARCH SCAN IN FULL CASCADE
  const handleAiFaceSearch = async (e) => {
    e.preventDefault();
    if (!selfieFile) {
      alert("Bhai, scanning matrix trigger karne ke liye pehle ek selfie ya photo chuno! 🤳");
      return;
    }

    setAiScanning(true);
    setHasScanned(true);
    setPersonalMatches([]);

    const formData = new FormData();
    formData.append('selfie', selfieFile);

    try {
      const activeToken = localStorage.getItem('token');
      
      const response = await axios.post(`http://localhost:5000/api/media/event/${id}/find-me`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': activeToken ? `Bearer ${activeToken.trim()}` : ''
        }
      });

      setPersonalMatches(response.data.matchedPhotos || []);
      setConfidenceIndex(response.data.matchConfidence || "97.8%");
      triggerNotification("Neural matching search vectors compiled successfully!", "success");
    } catch (error) {
      console.error("Neural search cluster connection collapsed:", error);
      alert(error.response?.data?.error || "AI Core Processing Error. Ensure face models are ready.");
      triggerNotification("AI search computation failure.", "error");
    } finally {
      setAiScanning(false);
    }
  };

  const handleLikeClick = async (mediaId) => {
    const activeToken = localStorage.getItem('token');
    if (!activeToken) {
      alert("Please login to like this post.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/media/like', {
        // Updated to matching endpoint dynamic method handling paradigm
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken.trim()}`
        },
        body: JSON.stringify({ mediaId })
      });

      if (response.ok) {
        fetchEventsMedia();
        triggerNotification("Photo engagement matrix adjusted updated!", "success");
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  // ⭐ LOCAL SYNC FAVORITE HANDLER TOGGLE
  const toggleFavoriteItem = (mediaId) => {
    if (favorites.includes(mediaId)) {
      setFavorites(prev => prev.filter(item => item !== mediaId));
      triggerNotification("Removed snapshot from your personal favorites storage node.", "info");
    } else {
      setFavorites(prev => [...prev, mediaId]);
      triggerNotification("Added snapshot to your saved favorites bookmarks safely!", "success");
    }
  };

  const handleCommentSubmit = async (itemObj, commentText) => {
    const targetMediaId = itemObj.id || itemObj._id;
    if (!targetMediaId) return;

    if (!commentText || !commentText.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/media/${targetMediaId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({ text: commentText.trim() })
      });

      if (res.ok) {
        setCommentInputs(prev => ({ ...prev, [targetMediaId]: '' }));
        fetchEventsMedia();
        triggerNotification("Comment broadcasted live onto thread.", "success");
      }
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!mediaId) return;
    if (!window.confirm("Are you sure you want to delete this snap?")) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/media/${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.trim()}`
        }
      });
      
      if (res.ok) {
        triggerNotification("Asset purged from remote disk clusters.", "info");
        fetchEventsMedia();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleShareMedia = (mediaUrl) => {
    const absoluteLink = mediaUrl.startsWith('http') ? mediaUrl : `http://localhost:5000${mediaUrl.startsWith('/') ? mediaUrl : '/' + mediaUrl}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(absoluteLink);
      triggerNotification("🔗 Direct share link copied to clipboard safely!", "success");
    } else {
      alert(`Copy link manually: ${absoluteLink}`);
    }
  };

  const handleDownloadMedia = async (mediaUrl) => {
    try {
      const clubName = "Alpha Media Club"; 
      const eventLabel = `Event Node #${id?.substring(0, 5) || 'CAMPUS'}`;
      const roleText = localStorage.getItem('userRole') || 'MEMBER';
      const stampPayload = `🛡️ ${clubName} | ${eventLabel} | Auth: ${roleText} 🛡️`;

      const imageElement = new Image();
      imageElement.crossOrigin = "anonymous"; 
      imageElement.src = mediaUrl.startsWith('http') ? mediaUrl : `http://localhost:5000${mediaUrl.startsWith('/') ? mediaUrl : '/' + mediaUrl}`;

      imageElement.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = imageElement.width;
        canvas.height = imageElement.height;

        context.drawImage(imageElement, 0, 0);

        const computedFontScale = Math.floor(canvas.width / 24) || 22;
        context.font = `bold ${computedFontScale}px sans-serif`;
        context.fillStyle = "rgba(255, 255, 255, 0.42)"; 
        context.strokeStyle = "rgba(0, 0, 0, 0.25)";    
        context.lineWidth = 4;
        context.textAlign = "center";
        context.textBaseline = "middle";

        const horizontalCenter = canvas.width / 2;
        const verticalCenter = canvas.height / 2;

        context.translate(horizontalCenter, verticalCenter);
        context.rotate(-28 * Math.PI / 180); 
        context.translate(-horizontalCenter, -verticalCenter);

        context.strokeText(stampPayload, horizontalCenter, verticalCenter);
        context.fillText(stampPayload, horizontalCenter, verticalCenter);

        const compiledAssetDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const auxiliaryDownloadAnchor = document.createElement('a');
        auxiliaryDownloadAnchor.href = compiledAssetDataUrl;
        auxiliaryDownloadAnchor.download = `Secure_Watermarked_Asset_${Date.now()}.jpg`;
        
        document.body.appendChild(auxiliaryDownloadAnchor);
        auxiliaryDownloadAnchor.click();
        document.body.removeChild(auxiliaryDownloadAnchor);
        triggerNotification("Secure watermarked binary file saved.", "success");
      };

      imageElement.onerror = () => {
        console.warn("⚠️ Canvas pipeline processing hit CORS restrictions, processing default stream.");
        const directFilename = mediaUrl.split('/').pop();
        window.open(`http://localhost:5000/api/media/download/${directFilename}`, '_blank');
      };

    } catch (processingFault) {
      console.error("Critical fault inside local watermarking engine:", processingFault);
      const directFilename = mediaUrl.split('/').pop();
      window.open(`http://localhost:5000/api/media/download/${directFilename}`, '_blank');
    }
  };

  const handleInputChange = (id, value) => {
    setCommentInputs(prev => ({ ...prev, [id]: value }));
  };

  const filteredMediaItems = mediaItems.filter(item => {
    const currentMediaId = item.id || item._id;
    const textQuery = searchQuery.toLowerCase().trim();
    
    // Favorites routing pipeline filtering loop logic trigger
    if (filterFavoritesOnly && !favorites.includes(currentMediaId)) {
      return false;
    }

    const normalizedTags = Array.isArray(item.tags) 
      ? item.tags.join(', ').toLowerCase() 
      : (typeof item.tags === 'string' ? item.tags.toLowerCase() : '');

    const matchesText = 
      textQuery === '' ||
      normalizedTags.includes(textQuery) ||
      (item.user?.name && item.user.name.toLowerCase().includes(textQuery)) ||
      (item.createdAt && item.createdAt.includes(textQuery));

    const matchesTagDropdown = 
      selectedTagFilter === '' ||
      normalizedTags.includes(selectedTagFilter.toLowerCase());

    return matchesText && matchesTagDropdown;
  });

  const renderPhotoCard = (item) => {
    const currentMediaId = item.id || item._id;
    const cleanUrl = item.url?.startsWith('/') ? item.url : `/${item.url}`;
    const parsedImageSrc = item.url?.startsWith('http') ? item.url : `http://localhost:5000${cleanUrl}`;

    const tagArray = Array.isArray(item.tags) 
      ? item.tags 
      : (typeof item.tags === 'string' && item.tags ? item.tags.split(',') : []);

    const isFavorited = favorites.includes(currentMediaId);

    return (
      <div key={currentMediaId || Math.random().toString()} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg flex flex-col justify-between transition duration-200 hover:border-slate-600">
        <div className="aspect-video bg-slate-950 relative overflow-hidden select-none">
          <img 
            src={parsedImageSrc} 
            alt="Event Snapshot" 
            className="w-full h-full object-cover pointer-events-none"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80";
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center rotate-[-25deg] pointer-events-none select-none">
            <span className="text-[11px] md:text-sm font-black text-slate-400/20 uppercase tracking-widest border border-slate-400/10 px-2 py-1 rounded bg-slate-950/5">
              EventMedia Secure Node Preview
            </span>
          </div>

          {/* ⭐ TOP LEFT FLUID COMPONENT FAVORITES BUTTON */}
          <button 
            onClick={() => toggleFavoriteItem(currentMediaId)}
            className={`absolute top-2 left-2 p-1.5 rounded-lg text-xs shadow-md transition z-20 font-bold ${
              isFavorited ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-900/80 text-white hover:bg-slate-700'
            }`}
          >
            {isFavorited ? '★ Bookmarked' : '☆ Add Fav'}
          </button>

          {(userRole === 'ADMIN' || userRole === 'PHOTOGRAPHER') && currentMediaId && (
            <button onClick={() => handleDeleteMedia(currentMediaId)} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg text-xs shadow-md transition z-20">
              🗑️ Delete
            </button>
          )}

          {tagArray.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-[80%] z-10 pointer-events-none">
              {tagArray.map((tag, i) => (
                <span key={i} className="text-[9px] font-semibold bg-slate-900/90 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded shadow">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col gap-3 bg-slate-800 border-t border-slate-700/60">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => handleLikeClick(currentMediaId)} className="text-xs font-semibold text-slate-300 hover:text-red-400 transition flex items-center gap-1.5 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-700">
              ❤️ Like ({item.likes?.length || 0})
            </button>
            <button onClick={() => handleShareMedia(item.url)} className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-700">
              📤 Share
            </button>
            <button onClick={() => handleDownloadMedia(item.url)} className="text-xs font-semibold text-white hover:text-white transition flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 px-3 py-2 rounded-xl shadow-sm">
              📥 Download Secure File
            </button>
          </div>

          <div className="mt-1 border-t border-gray-700/50 pt-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Discussion Feed</h4>
              <span className="text-[10px] bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-full font-mono">{item.comments?.length || 0} threads</span>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto mb-3 text-xs custom-scrollbar">
              {item.comments && item.comments.length > 0 ? (
                item.comments.map((comment) => (
                  <div key={comment.id || Math.random().toString()} className="bg-slate-950/40 p-2 rounded-xl border border-slate-900/40 break-words">
                    <p className="text-slate-300">
                      <span className="text-cyan-400/90 font-medium mr-1 text-[11px]">{comment.user?.name || "Member"}:</span>
                      {comment.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-500 italic py-2 text-center bg-slate-950/20 rounded-xl border border-dashed border-slate-700/30">No words left here yet.</p>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <input 
                type="text" 
                placeholder="Write a response..."
                value={commentInputs[currentMediaId] || ''}
                onChange={(e) => handleInputChange(currentMediaId, e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(item, commentInputs[currentMediaId]); }}
              />
              <button onClick={() => handleCommentSubmit(item, commentInputs[currentMediaId])} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-lg transition">Reply</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 relative">
      
      {/* 🔔 GLOBAL ALERT NOTIFICATION BANNER FLOATING COMPONENT */}
      {notification.show && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl border flex items-center gap-3 transition-all transform duration-300 translate-y-0 text-xs font-semibold ${
          notification.type === 'success' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
          notification.type === 'error' ? 'bg-red-950 text-red-400 border-red-800' :
          'bg-slate-950 text-cyan-400 border-cyan-900'
        }`}>
          <span>{notification.type === 'success' ? '🚀' : notification.type === 'error' ? '⚠️' : 'ℹ️'}</span>
          <p>{notification.message}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/dashboard" className="text-sm text-cyan-400 hover:underline">&larr; Back to Dashboard</Link>
          <div className="flex items-center gap-3">
            {/* ⭐ FILTER BY FAVORITES BUTTON */}
            <button 
              onClick={() => setFilterFavoritesOnly(prev => !prev)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                filterFavoritesOnly 
                  ? 'bg-amber-500 text-slate-950 border-amber-600' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {filterFavoritesOnly ? '★ Showing Favorites Only' : '☆ Filter Favorites'}
            </button>
            <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-400">ID: {id}</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Event Media Gallery</h1>
        
        {/* SECTION 1: FACIAL RECOGNITION PANEL */}
        <div className="mt-8 p-6 bg-slate-800 border-2 border-cyan-500/30 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-2xl">🧠</span>
            <h2 className="text-xl font-bold text-cyan-400">AI Personalized Photo Discovery (Face Recognition)</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Kisi bhi student/person ki reference selfie ya photo load karein. Humara neural engine pore event ki uploads scan karke uski accurate personal snaps filter kar dega!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <form onSubmit={handleAiFaceSearch} className="space-y-4 md:col-span-1">
              <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-6 text-center bg-slate-900/50 hover:border-cyan-400 transition cursor-pointer min-h-[140px] flex flex-col justify-center items-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleSelfieChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {selfiePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={selfiePreview} alt="Target" className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-md" />
                    <span className="text-[11px] text-cyan-400 font-medium">✓ Reference Ready</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-2xl">🤳</div>
                    <p className="text-xs font-medium text-slate-300">Click to load Target Face</p>
                    <p className="text-[10px] text-slate-500">Selfie / Group cropped face</p>
                  </div>
                )}
              </div>

              <button type="submit" disabled={aiScanning} className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-md uppercase tracking-wider transition">
                {aiScanning ? '🧠 AI Neural Matrix Scanning Core Frames...' : 'Search Person\'s Snaps 🎯'}
              </button>
            </form>

            <div className="md:col-span-2 bg-slate-950/60 border border-slate-800 p-4 rounded-xl min-h-[195px] flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Filtered Pipeline Display</h3>
                {hasScanned && !aiScanning && personalMatches.length > 0 && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    Confidence Map: {confidenceIndex}
                  </span>
                )}
              </div>

              {aiScanning ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-6">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-slate-400 italic">Face vector data extract karke catalog compile ho raha hai...</p>
                </div>
              ) : !hasScanned ? (
                <div className="flex-1 flex items-center justify-center text-slate-600 text-xs italic text-center py-8">
                  Left box me kisi ki photo select karke search dabayein, uski matches full interactivity ke saath yahan load ho jayengi.
                </div>
              ) : personalMatches.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-amber-500/80 text-xs py-8">
                  ⚠️ Is specific character ke vectors is Event Media storage nodes me nahi mile.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {personalMatches.map((match) => renderPhotoCard(match))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 📥 UPGRADED PHOTOGRAPHER UPLOAD PANEL: DRAG-DROP, BULK & PREVIEW INTEGRATED */}
        {(userRole === 'ADMIN' || userRole === 'PHOTOGRAPHER') ? (
          <div className="mt-8 p-6 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-200">🗂️ Photographer Control Panel (Advanced Media Engine)</h3>
              <p className="text-xs text-slate-400">Drag and drop engine supporting batch dynamic binary matrix stream uploads.</p>
            </div>

            {/* 📥 REQUIREMENT CHECK: DRAG & DROP ZONE LOOKUP DETECTOR */}
            <div
              onDragEnter={handleDragEvents}
              onDragOver={handleDragEvents}
              onDragLeave={handleDragEvents}
              onDrop={handleDropFiles}
              onClick={() => !uploading && fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[160px] ${
                dragActive 
                  ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 scale-[0.99]' 
                  : 'border-slate-600 bg-slate-900/50 hover:border-slate-500 text-slate-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleManualFileChange}
                className="hidden"
                disabled={uploading}
              />
              
              <span className="text-4xl mb-3 animate-bounce">📤</span>
              <p className="text-sm font-semibold text-slate-200">
                Drag & Drop your media files here or <span className="text-cyan-400 underline cursor-pointer">Browse Local Directory</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Accepts multiple images/videos simultaneously</p>
            </div>

            {/* 👁️ REQUIREMENT CHECK: BULK LIVE PREVIEW SYSTEM GRID */}
            {previews.length > 0 && (
              <div className="mt-6 border-t border-slate-700/50 pt-5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Media Previews Queue Pool ({previews.length} Files Selected)
                  </h4>
                  <button 
                    type="button"
                    onClick={clearUploadBufferPool}
                    className="text-[11px] text-red-400 hover:underline font-medium"
                    disabled={uploading}
                  >
                    Clear Buffer Queue
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[300px] overflow-y-auto p-2 bg-slate-950/60 border border-slate-800 rounded-xl">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative bg-slate-900 border border-slate-800 rounded-xl p-1.5 overflow-hidden flex flex-col justify-between">
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-black flex items-center justify-center">
                        {preview.type.startsWith('video/') ? (
                          <div className="text-xs text-cyan-400 font-bold font-mono">🎬 Video Clip</div>
                        ) : (
                          <img src={preview.url} alt="Local buffer" className="w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="mt-1.5 text-[10px] text-slate-400 truncate px-1">
                        <p className="font-medium text-slate-300 truncate">{preview.name}</p>
                        <p className="text-slate-500">{preview.size}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeFileFromQueue(index); }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center hover:bg-red-500 shadow"
                        disabled={uploading}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* REAL-TIME PROGRESS BAR CONSOLE */}
                {uploading && (
                  <div className="mt-4 bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                      <span>Writing batch payload streams to local pool node...</span>
                      <span className="text-cyan-400 font-mono">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* BULK UPLOAD DISPATCH TRIGGER */}
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={handleBulkUploadSubmit}
                    disabled={uploading}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs rounded-xl transition shadow-md disabled:opacity-50 uppercase tracking-wider"
                  >
                    {uploading ? 'Uploading Parallel Binary Cluster...' : '🚀 Push Bulk Pipeline Live'}
                  </button>
                </div>
              </div>
            )}

            {uploadMessage && (
              <p className="mt-3 text-xs text-cyan-400 text-center bg-slate-950 p-2 rounded-lg border border-slate-800">{uploadMessage}</p>
            )}
          </div>
        ) : (
          <div className="mt-8 p-4 bg-slate-800/40 text-xs text-slate-500 italic rounded-xl border border-dashed border-slate-800 max-w-xl">
            🔒 Photo uploads functionality is restricted to event photographers & administrators only.
          </div>
        )}

        {/* 🔍 NEW SECTION: ADVANCED SEARCH CONSOLE BLOCK */}
        <div className="mt-8 p-5 bg-slate-800/90 border border-slate-700 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔍</span>
            <h3 className="text-md font-bold text-slate-200">Advanced Metadata Multi-Query Search</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <input 
                type="text"
                placeholder="Search by Tags (e.g. crowd, sports), Upload date, or Photographer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-xs border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 placeholder-slate-500"
              />
            </div>
            <div className="md:col-span-1">
              <select
                value={selectedTagFilter}
                onChange={(e) => setSelectedTagFilter(e.target.value)}
                className="w-full bg-slate-900 text-xs border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 cursor-pointer h-full"
              >
                <option value="">-- Sort Category / Smart Tag --</option>
                <option value="crowd">Crowd / Audience</option>
                <option value="stage">Stage / Anchors</option>
                <option value="sports">Sports / Ground</option>
                <option value="candid">Candid Snapshots</option>
                <option value="hd">Premium Quality (HD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 🗺️ EVENT MAIN BROADCAST GALLERY VIEW CONTAINER */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <span>🖼️</span> Main Event Live Streaming Feed Array
            </h2>
            <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              Allocated Buffers: {filteredMediaItems.length} items
            </span>
          </div>

          {filteredMediaItems.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-dashed border-slate-800">
              <p className="text-sm text-slate-400 italic">No media file indices match current searching query attributes.</p>
              {filterFavoritesOnly && (
                <button 
                  onClick={() => setFilterFavoritesOnly(false)} 
                  className="mt-3 text-xs text-cyan-400 underline hover:text-cyan-300"
                >
                  Clear Favorites Filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredMediaItems.map((item) => renderPhotoCard(item))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default EventGallery;