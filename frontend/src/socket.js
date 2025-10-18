import io from "socket.io-client";

const token = localStorage.getItem("token");

export const socket = io("http://localhost:3000", {
  autoConnect: false,
  auth: { token },
});

if (token) {
  socket.connect();
}
