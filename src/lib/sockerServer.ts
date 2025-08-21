import { Server } from "socket.io";
import { NextApiResponse } from "next";

export function initSocketServer(res: NextApiResponse) {
  if ((res as any).socket?.io) return (res as any).socket.io; // already running

  const io = new Server((res as any).socket.server);

  (res as any).socket.io = io;

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join room for private chat between two users
    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
    });

    // Listen for messages
    socket.on("sendMessage", ({ roomId, message, senderId }) => {
      io.to(roomId).emit("receiveMessage", { message, senderId, createdAt: new Date() });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}
