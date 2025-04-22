const { createNotification, getNotifications, markAsRead } = require('../models/Notification');
const { getAllUsers } = require('../models/User'); // Assuming you have this function

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', async ({ userId }) => {
      socket.join(userId);
      const notifications = await getNotifications(userId);
      socket.emit('notifications', notifications);
    });

    socket.on('markAsRead', async ({ notificationId, userId }) => {
      await markAsRead(notificationId, userId);
      const notifications = await getNotifications(userId);
      socket.emit('notifications', notifications);
    });

    // Project event handlers
    socket.on('projectCreated', async (project) => {
      // Broadcast to all clients
      socket.broadcast.emit('projectCreated', project);
      
      // Create notifications for all users
      try {
        const users = await getAllUsers();
        for (const user of users) {
          await createNotification(`New project created: ${project.name}`, user.id);
          // Send updated notifications to connected user
          io.to(user.id.toString()).emit('notifications', await getNotifications(user.id));
        }
      } catch (error) {
        console.error('Error creating notifications:', error);
      }
    });

    socket.on('projectUpdated', async (project) => {
      // Broadcast to all clients
      socket.broadcast.emit('projectUpdated', project);
      
      // Create notifications for all users
      try {
        const users = await getAllUsers();
        for (const user of users) {
          await createNotification(`Project updated: ${project.name}`, user.id);
          // Send updated notifications to connected user
          io.to(user.id.toString()).emit('notifications', await getNotifications(user.id));
        }
      } catch (error) {
        console.error('Error creating notifications:', error);
      }
    });

    socket.on('projectDeleted', async ({ id, name }) => {
      // Broadcast to all clients
      socket.broadcast.emit('projectDeleted', { id });
      
      // Create notifications for all users
      try {
        const users = await getAllUsers();
        for (const user of users) {
          await createNotification(`Project deleted: ${name}`, user.id);
          // Send updated notifications to connected user
          io.to(user.id.toString()).emit('notifications', await getNotifications(user.id));
        }
      } catch (error) {
        console.error('Error creating notifications:', error);
      }
    });
  });
};

module.exports = initializeSocket;