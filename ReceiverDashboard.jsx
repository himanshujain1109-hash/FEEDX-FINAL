import { io } from "socket.io-client";

// In dev, Vite proxies /api and /uploads to the backend but sockets need the
// real backend origin. VITE_SOCKET_URL lets this be overridden in production.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  withCredentials: true,
});

// Call once a logged-in user is known so the server can target
// notifications and chat messages at this user's room.
export function joinUserRoom(userId) {
  if (userId) socket.emit("join", userId);
}

export default socket;
