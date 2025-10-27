import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Create uploads directory
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Initialize SQLite database
const dbPath = join(__dirname, 'voting.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS photos (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    title TEXT,
    votes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo_id TEXT NOT NULL,
    device_id TEXT NOT NULL,
    voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(photo_id, device_id),
    FOREIGN KEY(photo_id) REFERENCES photos(id)
  )
`);

// API Routes

// Health check endpoint for keep-alive pings
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all photos with vote status for current device
app.get('/api/photos', (req, res) => {
  try {
    const deviceId = req.query.deviceId;
    const photos = db.prepare('SELECT * FROM photos ORDER BY created_at DESC').all();
    
    if (deviceId) {
      // Check which photos this device has voted for
      const votedPhotoIds = db.prepare('SELECT photo_id FROM votes WHERE device_id = ?')
        .all(deviceId)
        .map(v => v.photo_id);
      
      // Add voted flag to each photo
      const photosWithVoteStatus = photos.map(photo => ({
        ...photo,
        hasVoted: votedPhotoIds.includes(photo.id)
      }));
      
      return res.json(photosWithVoteStatus);
    }
    
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload photo
app.post('/api/upload', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const photoId = uuidv4();
    const { title } = req.body;

    const stmt = db.prepare(`
      INSERT INTO photos (id, filename, original_name, title)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(photoId, req.file.filename, req.file.originalname, title || '');

    const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(photoId);
    res.status(201).json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve photo files
app.get('/api/photo/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Photo not found' });
  }
});

// Vote for a photo with device fingerprinting
app.post('/api/vote/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { voteType, deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID is required' });
    }

    // Check if device has already voted for this photo
    const existingVote = db.prepare('SELECT * FROM votes WHERE photo_id = ? AND device_id = ?').get(id, deviceId);
    
    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted for this photo' });
    }

    // Record the vote in votes table
    db.prepare('INSERT INTO votes (photo_id, device_id) VALUES (?, ?)').run(id, deviceId);

    // Update vote count based on vote type
    if (voteType === 'up') {
      db.prepare('UPDATE photos SET votes = votes + 1 WHERE id = ?').run(id);
    } else if (voteType === 'down') {
      db.prepare('UPDATE photos SET votes = votes - 1 WHERE id = ?').run(id);
    }

    const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id);
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if device has voted for a photo
app.get('/api/photos/:id/voted/:deviceId', (req, res) => {
  try {
    const { id, deviceId } = req.params;
    const vote = db.prepare('SELECT * FROM votes WHERE photo_id = ? AND device_id = ?').get(id, deviceId);
    res.json({ voted: !!vote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all votes for a device
app.get('/api/votes/:deviceId', (req, res) => {
  try {
    const { deviceId } = req.params;
    const votes = db.prepare('SELECT photo_id FROM votes WHERE device_id = ?').all(deviceId);
    res.json(votes.map(v => v.photo_id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a photo
app.delete('/api/photo/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Get photo info to delete file
    const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(id);
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Delete file from disk
    const filePath = join(uploadsDir, photo.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete votes for this photo
    db.prepare('DELETE FROM votes WHERE photo_id = ?').run(id);
    
    // Delete photo from database
    db.prepare('DELETE FROM photos WHERE id = ?').run(id);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = join(__dirname, '../client/dist');
  
  // Serve static files with proper headers
  app.use(express.static(clientBuildPath, {
    maxAge: '1d',
    etag: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));
  
  // Handle React routing - return all non-API requests to React app
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(clientBuildPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
