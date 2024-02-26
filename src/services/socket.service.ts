/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import { Server } from 'socket.io';

export class SocketService {
  constructor(private io: Server) {}

  on() {
    this.io.on('connection', (socket) => {
      console.log('A user connected');
      socket.on(
        'chat message',
        ({
          senderId,
          receiverId,
          message,
        }: {
          senderId: string;
          receiverId: string;
          message: string;
        }) => {
          this.emitMessageToSpecificUser({
            receiverId,
            senderId,
            message,
          });
          this.saveMessage({ senderId, message });
        }
      );
      socket.on(
        'notification',
        ({
          senderId,
          notification,
        }: {
          senderId: string;
          notification: string;
        }) => {
          this.emitNotificationToSpecificUser({ senderId, notification });
          this.saveNotificacition({ senderId, notification });
        }
      );
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }

  private saveMessage({
    senderId,
    receiverId,
    message,
  }: {
    senderId: string;
    receiverId: string;
    message: string;
  }) {}

  private emitMessageToSpecificUser({
    senderId,
    receiverId,
    message,
  }: {
    senderId: string;
    receiverId: string;
    message: string;
  }) {
    const receiverSocket = this.io.sockets.sockets.get(receiverId);
    if (receiverSocket) {
      this.io.to(receiverId).emit('chat message', { senderId, message });
      this.emitNotificationToSpecificUser({
        senderId,
        notification: 'Message notification',
      });
    }

    this.saveMessage({ message, receiverId, senderId });
  }

  private saveNotificacition({
    senderId,
    receiverId,
    notification,
  }: {
    senderId: string;
    receiverId: string;
    notification: string;
  }) {}

  private emitNotificationToSpecificUser({
    senderId,
    notification,
  }: {
    senderId: string;
    notification: string;
  }) {
    console.log(senderId, notification);
  }
}
