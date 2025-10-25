# Photo Voting Competition

A web application for photo voting competitions with real-time updates and persistent storage.

## Deployment

See [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) for deployment instructions.

## Features

- Photo upload functionality
- Upvote system with one vote per device
- Automatic refresh every 10 seconds
- Mobile-responsive Instagram-style grid layout
- Admin mode with password protection for photo deletion
- Persistent storage for photos and votes
- Muted monochrome interface design

## Technology Stack

- **Frontend**: React 18, Vite
- **Backend**: Node.js, Express
- **Database**: SQLite (better-sqlite3)
- **File Upload**: Multer
- **Styling**: CSS

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

Install dependencies for all packages:
```bash
npm run install-all
```

## Development

Start both frontend and backend servers:
```bash
npm run dev
```

The frontend will run on `http://localhost:5174` and the backend on `http://localhost:3001`.

## Application Details

### Voting System
- One vote per device per photo
- Vote tracking via localStorage
- Vote counts stored in SQLite database

### Photo Upload
- Maximum file size: 10MB
- Supported formats: All image types
- Photos stored in `server/uploads/`

### Updates
- Client polls server every 10 seconds for new data

## API Endpoints

- `GET /api/photos` - Retrieve all photos with vote counts
- `POST /api/upload` - Upload photo (multipart/form-data)
- `POST /api/vote/:id` - Submit vote for photo
- `DELETE /api/photo/:id` - Delete photo (admin only)
- `GET /api/photo/:filename` - Serve photo file

## Building for Production

```bash
npm run build
```

Built files output to `client/dist/`.

## Configuration

- Polling interval: 10 seconds (configurable in `client/src/App.jsx`)
- File size limit: 10MB (configurable in `server/index.js`)
- Admin password: `hwbadmin2025`
- Vote tracking is per-device (localStorage), not per-user
- No authentication required - perfect for simple competitions

## License

MIT
