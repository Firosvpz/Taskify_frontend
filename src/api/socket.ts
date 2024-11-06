import { io, Socket } from 'socket.io-client'; 

// const SOCKET_URL = 'http://localhost:5000"';
let socket: Socket;

export const initSocket = () => {
  socket =  io('ws://taskify-backend-qpae.onrender.com', { transports: ['websocket'] });
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket() first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

