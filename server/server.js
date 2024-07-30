import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: '*', 
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('message', (messageData) => {
    const { room, message, username } = messageData;
    io.to(room).emit('message', { username, message, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
