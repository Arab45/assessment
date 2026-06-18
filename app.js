import express from "express"
import cors from "cors"
import creatorCardRoutes from "./src/routes/creatorCard.routes.js"
import errorHandler from "./src/middleware/errorHandler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/', creatorCardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Creator Card API is running' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

export default app;