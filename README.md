Project Management Backend
This is the backend for a Project Management Application, built with Express.js, Socket.IO, and MongoDB (using MongoDB Atlas for cloud-hosted storage). It provides APIs for user authentication, project CRUD operations, and real-time notifications for project changes. The backend serves a Next.js frontend and uses MongoDB Atlas for online accessibility, making it shareable across teams.
Features

Authentication: Role-based login (Admin/Viewer) with JWT.
Project Management: Create, read, update, delete (CRUD) projects (Admin only).
Real-Time Notifications: Socket.IO broadcasts project changes and manages notification read/unread status.
Search: Filter projects by name or description.
Database: MongoDB Atlas for scalable, cloud-hosted data storage.

Project Structure
project-management-backend/
├── config/
│   └── db.js                 # MongoDB connection setup
├── routes/
│   ├── auth.js               # Authentication routes
│   └── projects.js           # Project CRUD routes
├── middleware/
│   └── auth.js               # JWT and role-based middleware
├── models/
│   ├── User.js               # User schema and operations
│   ├── Project.js            # Project schema and operations
│   └── Notification.js       # Notification schema and operations
├── sockets/
│   └── socket.js             # Socket.IO logic for real-time updates
├── server.js                 # Main Express server
├── seed.js                   # Script to seed initial users
├── package.json
└── README.md

Database Explanation
The backend uses MongoDB, a NoSQL database, hosted on MongoDB Atlas for online accessibility. Unlike a local PostgreSQL database, MongoDB Atlas allows team members to access the database from anywhere, making it ideal for sharing and collaboration. Data is stored as JSON-like documents in collections, which are flexible and scalable.
Database Collections

Users:
Stores user data: username (unique), password (hashed with bcrypt), role (Admin or Viewer).
Used for authentication and role-based access.


Projects:
Stores project data: name, description, created_at (timestamp).
Supports CRUD operations and search by name/description.


Notifications:
Stores notification data: message, user_id (references User), is_read (boolean), created_at.
Tracks real-time updates for project changes.



Why MongoDB Atlas?

Cloud-Hosted: Eliminates the need for local database setup, addressing accessibility issues with local PostgreSQL.
Scalability: Free tier (512 MB) is sufficient for testing; paid tiers support larger datasets.
Ease of Use: Provides a connection string for simple integration, managed via a web dashboard.

Prerequisites

Node.js (v16 or higher)
npm (v8 or higher)
MongoDB Atlas account (mongodb.com/cloud/atlas)
Git (for cloning and deployment)
Render account (for deployment, render.com)

Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/project-management-backend.git
cd project-management-backend

2. Install Dependencies
npm install

3. Set Up MongoDB Atlas
To connect to MongoDB Atlas:

Create an Account:

Sign up/log in at mongodb.com/cloud/atlas.
Create a project named project-management.


Create a Cluster:

Click Build a Cluster > Select Free Tier (M0 Sandbox, 512 MB).
Choose a provider (e.g., AWS) and region (e.g., US East).
Name it Cluster0 and click Create Cluster (takes ~5 minutes).


Configure Database Access:

Go to Database Access > Add New Database User.
Set:
Username: app_user
Password: securepassword123 (save this)
Role: Read and write to any database


Click Add User.


Configure Network Access:

Go to Network Access > Add IP Address.
Select Allow Access from Anywhere (0.0.0.0/0) for testing.
For production, add specific IPs (e.g., your local machine, deployed backend).


Get Connection String:

Go to Clusters > Connect > Connect Your Application (Node.js driver).
Copy the connection string:mongodb+srv://app_user:securepassword123@cluster0.abcdef.mongodb.net/project_management?retryWrites=true&w=majority


Replace app_user, securepassword123, cluster0.abcdef, and project_management with your values.



4. Configure Environment Variables

Create a .env file in the root directory:MONGO_URI=mongodb+srv://app_user:securepassword123@cluster0.abcdef.mongodb.net/project_management?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret


Generate a JWT_SECRET:openssl rand -base64 32

Example:JWT_SECRET=aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789


Add .env to .gitignore:.env



5. Seed Initial Data

Seed the database with admin and viewer users:node seed.js


Creates:
Username: admin, Password: password, Role: Admin
Username: viewer, Password: password, Role: Viewer



6. Start the Backend
npm start


Expected output:Server running on port 5000
MongoDB connected



7. Test APIs

Use Postman or cURL to test endpoints:
Login:curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"password","role":"Admin"}'

Response:{ "token": "...", "role": "Admin", "id": "..." }


Get Projects:curl -H "Authorization: Bearer <token>" http://localhost:5000/api/projects





Deployment (Render)

Push to GitHub:
git add .
git commit -m "Initial backend commit"
git push origin main


Create a Web Service:

Sign up/log in at render.com.
Click + New > Web Service.
Connect your GitHub repository.
Configure:
Name: project-management-backend
Environment: Node
Branch: main
Build Command: npm install
Start Command: npm start
Environment Variables:MONGO_URI=mongodb+srv://app_user:securepassword123@cluster0.abcdef.mongodb.net/project_management?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret


Instance Type: Free (for testing)


Click Create Web Service.


Verify:

Get the URL (e.g., https://project-management-backend.onrender.com).
Update the frontend to use this URL.
Update CORS in server.js:const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://project-management-frontend.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
app.use(cors({
  origin: ['http://localhost:3000', 'https://project-management-frontend.onrender.com'],
}));





Troubleshooting

MongoDB Connection Error (querySrv ENOTFOUND):
Verify MONGO_URI (username, password, cluster name).
Ensure Atlas Network Access allows 0.0.0.0/0.
Test with MongoDB Compass or:node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('Connected')).catch(console.error)"




CORS Issues:
Check server.js CORS settings for the frontend URL.


API Errors:
Ensure JWT token is valid and included in requests.
Verify MongoDB collections (users, projects, notifications) exist.



How It Works

Server: server.js sets up Express, Socket.IO, and MongoDB connection via config/db.js.
Database: MongoDB Atlas stores data in three collections (users, projects, notifications), accessed via Mongoose models (models/*.js).
APIs: routes/auth.js handles login; routes/projects.js manages project CRUD.
Real-Time: sockets/socket.js uses Socket.IO to broadcast project changes and manage notifications.
Security: JWT (middleware/auth.js) ensures role-based access (Admin for CRUD, Viewer for read-only).

