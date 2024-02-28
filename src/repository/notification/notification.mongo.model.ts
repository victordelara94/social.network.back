import { Schema, model } from 'mongoose';
import { Notification } from '../../entities/notification.entity';

const NotificationSchema = new Schema<Notification>({
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  type: String, // Tipo de notificación (seguido, like, respuesta, etc.)
  from: { type: Schema.Types.ObjectId, refPath: 'user' },
  hasBeenRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

NotificationSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const NotificationModel = model(
  'Notification',
  NotificationSchema,
  'notifications'
);
