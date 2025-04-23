const mongoose = require('mongoose');
const { createNotification, getNotifications, markAsRead } = require('../models/Notification');
const { getAllUsers } = require('../models/User');

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join', async ({ userId }) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.error('Invalid userId in join:', userId);
        return;
      }

      socket.join(userId);
      console.log(`User joined room: ${userId}`);

      try {
        const notifications = await getNotifications(userId);
        socket.emit('notifications', notifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    });

    socket.on('markAsRead', async ({ notificationId, userId }) => {
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(notificationId)) {
        console.error('Invalid userId or notificationId in markAsRead');
        return;
      }

      try {
        await markAsRead(notificationId, userId);
        const notifications = await getNotifications(userId);
        socket.emit('notifications', notifications);
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    });

    const notifyAllUsers = async (message) => {
      try {
        const users = await getAllUsers();
        for (const user of users) {
          await createNotification(message, user.id);
          const updated = await getNotifications(user.id);
          io.to(user.id.toString()).emit('notifications', updated);
        }
      } catch (err) {
        console.error('Error sending notifications:', err);
      }
    };

    socket.on('projectCreated', async (project) => {
      console.log('Project created:', project.name);
      socket.broadcast.emit('projectCreated', project);
      await notifyAllUsers(`New project created: ${project.name}`);
    });

    socket.on('projectUpdated', async (project) => {
      console.log('Project updated:', project.name);
      socket.broadcast.emit('projectUpdated', project);
      await notifyAllUsers(`Project updated: ${project.name}`);
    });

    socket.on('projectDeleted', async ({ id, name }) => {
      console.log('Project deleted:', name);
      socket.broadcast.emit('projectDeleted', { id });
      await notifyAllUsers(`Project deleted: ${name}`);
    });
  });
};

module.exports = initializeSocket;
