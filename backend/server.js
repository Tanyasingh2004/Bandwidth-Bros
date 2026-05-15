require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/config/db');

// 1. Create http.Server from the Express app
const server = http.createServer(app);

// 2. Attach Socket.IO to that server
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ["GET", "POST"]
  }
});

// 3. Pass the io instance into wherever it's needed
app.locals.io = io;

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// 4. Connect to MongoDB first, then start listening
async function startServer() {
  await connectDB();
  
  server.listen(PORT, () => {
    // 5. Log the port when ready
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
