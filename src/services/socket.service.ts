/* eslint-disable no-unused-vars */

import createDebug from 'debug';
import { Server, Socket } from 'socket.io';
import { MessageController } from '../controllers/message.controller';
const debug = createDebug('SN:SocketService');
export class SocketService {
  constructor(
    private io: Server,
    private messageController: MessageController
  ) {
    debug('instantiated');
  }

  config() {
    this.io.on('connection', (socket) => {
      const { userId } = socket.handshake.auth;
      console.log('A user connected');
      const events = socket.eventNames();

      if (events.includes('chat message')) {
        this.onMessage(socket, userId);
      }

      if (events.includes('notification')) {
        this.onNotification(socket, userId);
      }

      socket.on('disconnect', () => {
        // Tendre que asignar a auth el id del usuario
        this.io.emit('user-disconnected', { userId });
        console.log('User disconnected');
      });
    });
  }

  private onMessage(socket: Socket, userId: string) {
    socket.on(
      'chat message',
      ({ receiverId, message }: { receiverId: string; message: string }) => {
        this.emitMessageToSpecificUser({
          receiverId,
          userId,
          message,
        });
      }
    );
  }

  private onNotification(socket: Socket, userId: string) {
    socket.on(
      'notification',
      ({ receiverId, type }: { receiverId: string; type: string }) => {
        this.emitNotificationToSpecificUser({ type, userId, receiverId });
      }
    );
  }

  private emitMessageToSpecificUser({
    userId,
    receiverId,
    message,
  }: {
    userId: string;
    receiverId: string;
    message: string;
  }) {
    const receiverSocket = this.io.sockets.sockets.get(receiverId);
    if (receiverSocket) {
      this.io.to(receiverId).emit('chat message', { userId, message });
      this.emitNotificationToSpecificUser({
        type: 'message',
        userId,
        receiverId,
      });
    }
  }

  private emitNotificationToSpecificUser({
    type,
    userId,
    receiverId,
  }: {
    type: string;
    userId: string;
    receiverId: string;
  }) {
    const receiverSocket = this.io.sockets.sockets.get(receiverId);
    this.io.to(receiverId).emit('notification', { type, userId });
  }
}
