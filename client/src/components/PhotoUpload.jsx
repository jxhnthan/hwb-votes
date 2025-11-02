import { useState } from 'react';
import './PhotoUpload.css';

function PhotoUpload({ apiUrl, onSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate all files
    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('All files must be images');
        return;
      }

      // Check file size (max 10MB per file)
      if (file.size > 10 * 1024 * 1024) {
        setError('Each file must be less than 10MB');
        return;
      }

      validFiles.push(file);
    }

    setSelectedFiles(validFiles);
    setError('');

    // Create previews for all files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setPreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError('Please select at least one photo');
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

    try {
      // Upload all files sequentially
      let uploadedCount = 0;
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('title', title);
        formData.append('value', value);

        console.log('Uploading:', file.name, 'Size:', file.size);

        const response = await fetch(`${apiUrl}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
          console.error('Upload error:', errorData);
          throw new Error(errorData.error || 'Upload failed');
        }

        uploadedCount++;
        console.log(`Upload success: ${uploadedCount}/${selectedFiles.length}`);
      }

      // Reset form
      setSelectedFiles([]);
      setPreviews([]);
      setTitle('');
      setValue('');
      setUploading(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Upload exception:', err);
      setError(`Failed to upload photos: ${err.message}`);
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
            Select Photo(s) - Upload multiple photos at once
          </label>
          <input
            type="file"
            id="photo"
            className="file-input"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
          <label htmlFor="photo" className="file-label">
            {selectedFiles.length > 0 ? `${selectedFiles.length} photo(s) selected` : 'Choose photo(s)...'}
          </label>
        </div>

        {previews.length > 0 && (
          <div className="preview-grid">
            {previews.map((preview, index) => (
              <div key={index} className="preview">
                <img src={preview} alt={`Preview ${index + 1}`} className="preview-image" />
              </div>
            ))}
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
            disabled={uploading || selectedFiles.length === 0 || !title}
          >
            {uploading ? 'Uploading...' : selectedFiles.length > 1 ? `Upload ${selectedFiles.length} Photos` : 'Upload Photo'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PhotoUpload;
