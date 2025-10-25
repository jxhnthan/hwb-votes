# HWB Votes - Photo Voting Competition

Vote for your favourite costume!

## Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new)

See [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) for detailed deployment instructions.

## Features

- ✨ Upload photos
- 🔼 Upvote your favorites  
- 🔄 Auto-refresh every 10 seconds
- 📱 Mobile-friendly Instagram-style grid
- � Admin mode to delete photos (password: `hwbadmin2025`)
- 💾 Persistent storage (photos & votes saved)
- 🎨 Muted monochrome design  

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **File Upload**: Multer
- **Styling**: Pure CSS with CSS variables

## Project Structure

```
hwb-votes/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── PhotoUpload.jsx
│   │   │   ├── PhotoUpload.css
│   │   │   ├── PhotoGallery.jsx
│   │   │   └── PhotoGallery.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
├── server/              # Express backend
│   ├── index.js
│   ├── uploads/         # Uploaded photos
│   └── voting.db        # SQLite database
└── package.json
```

## Installation

1. **Install all dependencies** (root, client, and server):
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

## Running the App

### Development Mode (Both servers)

From the root directory:
```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:3001`

### Run Separately

**Frontend only:**
```bash
npm run client
```

**Backend only:**
```bash
npm run server
```

## How It Works

### Voting System
- Each device can vote once per photo
- Votes are tracked using localStorage on the frontend
- Vote counts are stored in SQLite database on the backend
- Users can see if they've already voted (heart icon turns red)

### Photo Upload
- Maximum file size: 5MB
- Accepts: All image formats (jpg, png, gif, etc.)
- Each photo requires a title
- Photos are stored in `server/uploads/`

### Auto-Updates
- Gallery polls the server every 10 seconds
- New uploads appear automatically
- Vote counts update in real-time

## API Endpoints

### GET `/api/photos`
Returns all photos with vote counts

### POST `/api/upload`
Upload a new photo
- Body: `multipart/form-data`
- Fields: `photo` (file), `title` (string)

### POST `/api/vote/:id`
Vote for a photo by ID
- Increments vote count

### GET `/api/photo/:filename`
Serves uploaded photo files

## Customization

### Colors
Edit CSS variables in `client/src/App.css`:
```css
:root {
  --color-bg: #ffffff;
  --color-text-primary: #37352f;
  --color-border: #e3e2df;
  /* ... more variables */
}
```

### Polling Interval
Change auto-refresh interval in `client/src/App.jsx`:
```javascript
const interval = setInterval(fetchPhotos, 10000); // 10 seconds
```

### File Size Limit
Change max upload size in `server/index.js`:
```javascript
limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
```

## Building for Production

```bash
npm run build
```

The built files will be in `client/dist/`

## Notes

- SQLite database (`voting.db`) is created automatically on first run
- Uploads directory is created automatically
- Vote tracking is per-device (localStorage), not per-user
- No authentication required - perfect for simple competitions

## License

MIT
