import { Server } from 'socket.io';
import { Message } from '../models/message.model.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  const userSockets = new Map();
  const userActivities = new Map();

  io.on('connection', (socket) => {
    socket.on('user_connected', (uid) => {
      userSockets.set(uid, socket.id);
      userActivities.set(uid, 'Idle');
      io.emit('user_connected', uid);

      socket.emit('users_online', Array.from(userSockets.keys()));

      io.emit('activities', Array.from(userSockets.entries()));
    });

    socket.on('update_activity', ({ uid, activity }) => {
      userActivities.set(uid, activity);
      io.emit('activity_updated', { uid, activity });
    });

    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        const receiverSocketId = userSockets.get(receiverId);
        const senderSocketId = userSockets.get(senderId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', message);
        }

        if (senderSocketId) {
          io.to(senderSocketId).emit('receive_message', message);
        }
      } catch (error) {
        console.error('Socket error:', error);
        socket.emit('message_error', error.message);
      }
    });

    socket.on('disconnect', () => {
      let disconnectUserId = null;
      for (const [uid, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectUserId = uid;
          userSockets.delete(uid);
          userActivities.delete(uid);
          break;
        }
      }
      if (disconnectUserId) {
        io.emit('user_disconnected', disconnectUserId);
      }
    });
  });
};
