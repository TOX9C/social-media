import io from "socket.io-client";
import { API_URL } from './config';

const token = localStorage.getItem("token");

export const socket = io(API_URL, {
  autoConnect: false,
  auth: { token },
});

if (token) {
  socket.connect();
}
