import { io, Socket } from 'socket.io-client'; 

const SOCKET_URL = 'https://taskify-backend-a9yp.onrender.com';
let socket: Socket;

export const initSocket = () => {
<<<<<<< HEAD
  socket = io(SOCKET_URL);
=======
  socket =  io('ws://taskify-backend-qpae.onrender.com', { transports: ['websocket'] });
>>>>>>> 099a9b40c520a8ff9edd025264e1b676b290cdb5
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

