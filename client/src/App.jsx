import { useState, useEffect } from 'react';
import './App.css';
import PhotoUpload from './components/PhotoUpload';
import PhotoGallery from './components/PhotoGallery';

// Use production API URL if deployed, otherwise localhost
const API_URL = import.meta.env.PROD 
  ? window.location.origin + '/api'
  : 'http://localhost:3001/api';

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);

  // Fetch photos from backend
  const fetchPhotos = async () => {
    try {
      const response = await fetch(`${API_URL}/photos`);
      const data = await response.json();
      setPhotos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setLoading(false);
    }
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowAdminPrompt(true);
    }
  };

  const handleAdminLogin = (password) => {
    if (password === 'hwbadmin2025') {
      setIsAdmin(true);
      setShowAdminPrompt(false);
    } else {
      alert('Incorrect password');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/photo/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPhotos();
      } else {
        alert('Failed to delete photo');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo');
    }
  };

  // Initial fetch and polling for updates
  useEffect(() => {
    fetchPhotos();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchPhotos, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleUploadSuccess = () => {
    setShowUpload(false);
    fetchPhotos();
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchPhotos();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="title">HWB Votes</h1>
          <p className="tagline">Vote for your favourite costume!</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-icon"
            onClick={handleRefresh}
            title="Refresh"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
          <button 
            className={`btn ${isAdmin ? 'btn-admin-active' : ''}`}
            onClick={handleAdminToggle}
          >
            {isAdmin ? '🔓 Admin' : '🔒 Admin'}
          </button>
          <button 
            className="btn btn-upload"
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? '✕ Close' : '+ Upload'}
          </button>
        </div>
      </header>

      {showAdminPrompt && (
        <div className="modal-overlay" onClick={() => setShowAdminPrompt(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Admin Login</h2>
            <input
              type="password"
              placeholder="Enter admin password"
              className="admin-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdminLogin(e.target.value);
                }
              }}
              autoFocus
            />
            <div className="modal-actions">
              <button 
                className="btn"
                onClick={() => setShowAdminPrompt(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={(e) => {
                  const input = e.target.parentElement.previousElementSibling;
                  handleAdminLogin(input.value);
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        {showUpload && (
          <PhotoUpload 
            apiUrl={API_URL} 
            onSuccess={handleUploadSuccess}
          />
        )}

        {loading ? (
          <div className="loading">Loading photos...</div>
        ) : (
          <PhotoGallery 
            photos={photos} 
            apiUrl={API_URL}
            onVote={fetchPhotos}
            isAdmin={isAdmin}
            onDelete={handleDeletePhoto}
          />
        )}
      </main>
    </div>
  );
}

export default App;
