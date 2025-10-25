import { useState } from 'react';
import './PhotoUpload.css';

function PhotoUpload({ apiUrl, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a photo');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('title', title);

    try {
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setTitle('');
      setUploading(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Failed to upload photo. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="upload-card">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Photo Title
          </label>
          <input
            type="text"
            id="title"
            className="form-input"
            placeholder="Enter a title for your photo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="photo" className="form-label">
            Select Photo
          </label>
          <input
            type="file"
            id="photo"
            className="file-input"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <label htmlFor="photo" className="file-label">
            {selectedFile ? selectedFile.name : 'Choose a photo...'}
          </label>
        </div>

        {preview && (
          <div className="preview">
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading || !selectedFile || !title}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PhotoUpload;
