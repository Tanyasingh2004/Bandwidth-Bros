const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const networkRoutes = require('./routes/network.routes');

const app = express();

// 1. cors
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// 2. express.json()
app.use(express.json());

// 3. request logger
app.use(morgan('dev'));

// 4. mount routes
app.use('/api/network', networkRoutes);

// 5. 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 6. global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error', detail: err.message });
});

module.exports = app;
