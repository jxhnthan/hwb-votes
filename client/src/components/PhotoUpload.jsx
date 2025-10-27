import { useState } from 'react';
import './PhotoUpload.css';

function PhotoUpload({ apiUrl, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
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
    if (!value) {
      setError('Please select a value');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
  formData.append('photo', selectedFile);
  formData.append('title', title);
  formData.append('value', value);

    console.log('Uploading to:', `${apiUrl}/upload`);
    console.log('File:', selectedFile.name, 'Size:', selectedFile.size);

    try {
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        console.error('Upload error:', errorData);
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload success:', data);

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setTitle('');
      setUploading(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Upload exception:', err);
      setError(`Failed to upload photo: ${err.message}`);
      setUploading(false);
    }
  };

  return (
    <div className="upload-card">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Your Name and Description of Costume
          </label>
          <input
            type="text"
            id="title"
            className="form-input"
            placeholder="e.g. John - Superhero Costume"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
          />
        </div>
        <div className="form-group">
          <label htmlFor="value" className="form-label">
            Select Value
          </label>
          <select
            id="value"
            className="form-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            <option value="Authenticity">Authenticity</option>
            <option value="Compassion">Compassion</option>
            <option value="Growth">Growth</option>
            <option value="Respect">Respect</option>
          </select>
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
