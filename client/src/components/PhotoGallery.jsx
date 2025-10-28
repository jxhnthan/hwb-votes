import { useState, useEffect } from 'react';
import './PhotoGallery.css';

function PhotoGallery({ photos, apiUrl, deviceId, onVote, isAdmin, onDelete }) {
  const [votedPhotos, setVotedPhotos] = useState({});
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [filterValue, setFilterValue] = useState('');

  // Load voted photos from server response (photos now include hasVoted flag)
  useEffect(() => {
    const votedMap = {};
    photos.forEach(photo => {
      if (photo.hasVoted) {
        votedMap[photo.id] = 'up';
      }
    });
    setVotedPhotos(votedMap);
  }, [photos]);

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
        body: JSON.stringify({ voteType, deviceId }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Vote failed');
        return;
      }

      // Update local state
      const newVotedPhotos = { ...votedPhotos, [photoId]: voteType };
      setVotedPhotos(newVotedPhotos);

      // Refresh photos to get updated vote counts
      if (onVote) {
        onVote();
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to submit vote');
    }
  };

  // Filter and sort photos by votes (descending)
  const filteredPhotos = filterValue
    ? photos.filter(photo => photo.value === filterValue)
    : photos;
  const sortedPhotos = [...filteredPhotos].sort((a, b) => b.votes - a.votes);

  // Create grid with 12 total slots
  const gridSize = 12;
  const gridItems = [];

  // Add photos
  for (let i = 0; i < gridSize; i++) {
    if (i < sortedPhotos.length) {
      const photo = sortedPhotos[i];
      const userVote = votedPhotos[photo.id];
      gridItems.push(
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
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <div className="photo-wrapper">
              <img
                src={`${apiUrl}/photo/${photo.filename}`}
                alt={photo.title}
                className="photo-image"
                loading="lazy"
              />
              <div className="photo-title-overlay">
                {photo.title}
              </div>
            </div>
          </div>
          <div className="photo-footer">
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
    } else {
      // Add placeholder
      gridItems.push(
        <div key={`placeholder-${i}`} className="photo-card placeholder">
          <div className="placeholder-content">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <div className="gallery-tags">
        {['All', 'Authenticity', 'Compassion', 'Growth', 'Respect'].map(val => (
          <button
            key={val}
            className={`tag-btn${filterValue === val || (val === 'All' && !filterValue) ? ' active' : ''}`}
            onClick={() => setFilterValue(val === 'All' ? '' : val)}
            type="button"
          >
            {val}
          </button>
        ))}
      </div>
      <div className="gallery">
        {gridItems}
      </div>
      {viewingPhoto ? (
        <div className="photo-viewer" onClick={() => setViewingPhoto(null)}>
          <div className="viewer-hint">Tap to close</div>
          <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`${apiUrl}/photo/${viewingPhoto.filename}`}
              alt={viewingPhoto.title}
              className="viewer-image"
            />
            <div className="viewer-info">
              <h2>{viewingPhoto.title}</h2>
              <div className="viewer-value">{viewingPhoto.value}</div>
              <div className="viewer-votes">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                <span>{viewingPhoto.votes || 0} votes</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default PhotoGallery;
