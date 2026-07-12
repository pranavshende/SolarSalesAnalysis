const dotenv = require('dotenv');
// Load environment variables immediately
dotenv.config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const passport = require('./config/passport');
const { initSocket } = require('./services/socket');
const sequelize = require('./config/db');

// Import models to ensure they are registered with Sequelize
const User = require('./models/User');
const SolarData = require('./models/SolarData');

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

// Attach socket.io to app to use in controllers
app.set('socketio', io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, 
}));
app.use(morgan('dev'));
app.use(passport.initialize());

// Routes
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const debugRoutes = require('./routes/debugRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/debug', debugRoutes);

// Health Check
app.get('/api/debug/test-forecast', async (req, res) => {
  const analyticsController = require('./controllers/analyticsController');
  req.query = { state: 'Karnataka', city: 'All' };
  await analyticsController.getForecast(req, res);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Solar Intelligence & Sales Optimization Backend (Postgres) is running' });
});

// Database Connection
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL Database');
    // Sync models
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized');
    server.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

// Graceful Shutdown
process.on('SIGTERM', () => {
  server.close(async () => {
    await sequelize.close();
    console.log('Server and DB connection closed');
  });
});
