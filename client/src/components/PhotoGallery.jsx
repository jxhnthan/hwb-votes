import { useState, useEffect } from 'react';
import './PhotoGallery.css';

function PhotoGallery({ photos, apiUrl, onVote, isAdmin, onDelete }) {
  const [votedPhotos, setVotedPhotos] = useState({});
  const [viewingPhoto, setViewingPhoto] = useState(null);

  // Load voted photos from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('votedPhotos');
    if (stored) {
      setVotedPhotos(JSON.parse(stored));
    }
  }, []);

  const handleVote = async (photoId, voteType) => {
    // Check if already voted
    if (votedPhotos[photoId]) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/vote/${photoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      });

      if (!response.ok) {
        throw new Error('Vote failed');
      }

      // Update local state
      const newVotedPhotos = { ...votedPhotos, [photoId]: voteType };
      setVotedPhotos(newVotedPhotos);

      // Save to localStorage
      localStorage.setItem('votedPhotos', JSON.stringify(newVotedPhotos));

      // Refresh photos
      if (onVote) {
        onVote();
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  // Sort photos by votes (descending)
  const sortedPhotos = [...photos].sort((a, b) => b.votes - a.votes);

  return (
    <>
      <div className="gallery">
        {sortedPhotos.map(photo => {
          const userVote = votedPhotos[photo.id];
          
          return (
            <div key={photo.id} className="photo-card">
              {isAdmin && (
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(photo.id);
                  }}
                  title="Delete photo"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              )}
              
              <div 
                className="photo-content"
                onClick={() => setViewingPhoto(photo)}
                style={{ cursor: 'pointer' }}
              >
                <div className="photo-wrapper">
                  <img
                    src={`${apiUrl}/photo/${photo.filename}`}
                    alt={photo.title}
                    className="photo-image"
                    loading="lazy"
                  />
                </div>
              </div>
              
              <div className="photo-footer">
                <h3 className="photo-title">{photo.title}</h3>
                <div className="vote-actions">
                  <button
                    className={`vote-btn ${userVote === 'up' ? 'active' : ''}`}
                    onClick={() => handleVote(photo.id, 'up')}
                    disabled={!!userVote}
                    title="Upvote"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </button>
                  <span className="vote-count">{photo.votes || 0}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {viewingPhoto && (
        <div className="photo-viewer" onClick={() => setViewingPhoto(null)}>
          <button 
            className="viewer-close"
            onClick={() => setViewingPhoto(null)}
            title="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`${apiUrl}/photo/${viewingPhoto.filename}`}
              alt={viewingPhoto.title}
              className="viewer-image"
            />
            <div className="viewer-info">
              <h2>{viewingPhoto.title}</h2>
              <div className="viewer-votes">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                <span>{viewingPhoto.votes || 0} votes</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PhotoGallery;
