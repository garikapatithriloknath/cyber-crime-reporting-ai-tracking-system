import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    default: '',
  },
  userEmail: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['status_update', 'announcement', 'alert', 'assignment'],
    default: 'status_update',
  },
  complaintId: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
