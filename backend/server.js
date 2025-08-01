import express from 'express';
import { default as router } from './chatRoutes/routesForChat.js';

import authMiddleware from './middleware/authMiddleware.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
app.set('trust proxy', 1);

const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://clevin.vercel.app'
  ], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));


app.use(express.json());



app.use('/api/chat', authMiddleware, router);

app.get('/', (req, res) => {
  res.json({ message: 'Hello World! Server is running.' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
