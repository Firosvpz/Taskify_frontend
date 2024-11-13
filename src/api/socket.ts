import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://taskify-backend-pluy.onrender.com";
let socket: Socket;

export const initSocket = (token:string) => {
  socket = io(SOCKET_URL,{
    auth:{
      token
    }
  });
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket() first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
