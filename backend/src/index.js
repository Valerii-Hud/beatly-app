import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cron from 'node-cron';
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.route.js';
import authRoutes from './routes/auth.route.js';
import songRoutes from './routes/song.route.js';
import albumRoutes from './routes/album.route.js';
import statRoutes from './routes/stat.route.js';
import fs from 'fs';
import { connectDB } from './lib/db.js';
import { createServer } from 'http';
import { initializeSocket } from './lib/socket.js';

dotenv.config({});
const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: {
      fileSize: 25 * 1024 * 1024,
    },
  })
);

const tempDir = path.join(process.cwd(), 'tmp');
cron.schedule('0 * * * *', () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (error, files) => {
      if (error) {
        console.error(`Cron error on deleting tmp files: ${error.message}`);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (error) => {});
      }
    });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });
}

app.use((error, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message,
  });
});

httpServer.listen(PORT, () => {
  connectDB(process.env.MONGO_URI);
  console.log(`Server is running on: http://localhost:${PORT}`);
});
