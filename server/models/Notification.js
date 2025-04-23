const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

const createNotification = async (message, userId) => {
  const notification = new Notification({ message, user_id: userId });
  return await notification.save();
};

const getNotifications = async (userId) => {
  return await Notification.find({ user_id: userId }).sort({ created_at: -1 });
};

const markAsRead = async (notificationId, userId) => {
  if (
    !mongoose.Types.ObjectId.isValid(notificationId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) return;

  await Notification.updateOne(
    { _id: notificationId, user_id: userId },
    { $set: { read: true } }
  );
};


module.exports = { createNotification, getNotifications, markAsRead };