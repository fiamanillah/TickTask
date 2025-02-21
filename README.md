# TickTask - Task Management Application

TickTask is a modern task management application that allows users to add, edit, delete, and reorder tasks with a smooth drag-and-drop interface. The app ensures real-time updates using WebSockets and MongoDB, providing a seamless experience for task tracking.

---

## 🚀 Live Demo

🔗 [Live Application](#) _(Add the live link once deployed)_

---

## ✨ Features

✅ **Authentication**: Users can sign in using Google authentication via Firebase.
✅ **Task Management**:

-   Add, edit, delete, and reorder tasks.
-   Categorize tasks into `To-Do`, `In Progress`, and `Done`.
-   Drag and drop functionality for reordering and moving tasks.
    ✅ **Database & Persistence**:
-   Uses MongoDB to store tasks.
-   Real-time synchronization using WebSockets.
    ✅ **Responsive UI**: Works seamlessly across all devices.
    ✅ **Modern Design**: Clean and minimal UI with a professional layout.

---

## 🛠 Tech Stack

### **Frontend**

-   ⚡ React.js (Vite.js)
-   🔥 Firebase Authentication
-   🎨 Tailwind CSS
-   🖱️ DnD Kit for drag-and-drop functionality
-   🔄 Axios for API requests

### **Backend**

-   🛠️ Node.js with Express.js
-   🗄️ MongoDB (Mongoose for schema modeling)
-   🌐 WebSockets (Socket.io) for real-time updates
-   🔐 CORS & dotenv for configuration

---

## 📌 Installation & Setup

### **Prerequisites**

Ensure you have the following installed on your machine:

-   🟢 [Node.js](https://nodejs.org/)
-   🗄️ [MongoDB](https://www.mongodb.com/)
-   🔵 [Git](https://git-scm.com/)

---

## 🔧 Backend Setup

```sh
# Clone the repository
git clone https://github.com/yourusername/ticktask-backend.git
cd ticktask-backend

# Install dependencies
npm install

# Create a .env file in the root directory and add the following environment variables:
```

#### 📝 .env file (Backend)

```
MONGODB_URI=mongodb+srv://your_username:your_password@your-cluster.mongodb.net/TickTask?retryWrites=true&w=majority&appName=Cluster0
VITE_BACKEND_URI=http://localhost:5000/
```

```sh
# Start the backend server
npm start
```

---

## 🎨 Frontend Setup

```sh
# Clone the repository
git clone https://github.com/yourusername/ticktask-frontend.git
cd ticktask-frontend

# Install dependencies
npm install

# Create a .env file in the root directory and add the following variables:
```

#### 📝 .env file (Frontend)

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_BACKEND_URI=http://localhost:5000/
```

```sh
# Start the frontend server
npm run dev
```

---

## 📂 Folder Structure

### 🏗 **Frontend (`ticktask-frontend`):**

```
/src
  /components  # Reusable UI components
  /pages       # Main application pages
  /context     # Context API for state management
  /hooks       # Custom React hooks
  /utils       # Utility functions
```

### 🏗 **Backend (`ticktask-backend`):**

```
/src
  /models      # Mongoose models
  /routes      # Express routes
  /controllers # Logic handling API requests
  /config      # Configuration files (e.g., database connection)
  /middlewares # Middleware functions
```

---

## 🔗 API Endpoints

| Method | Endpoint   | Description    |
| ------ | ---------- | -------------- |
| POST   | /tasks     | Add a new task |
| GET    | /tasks     | Get all tasks  |
| PUT    | /tasks/:id | Update a task  |
| DELETE | /tasks/:id | Delete a task  |

---

## 🤝 Contributing

If you'd like to contribute, please fork the repository and submit a pull request with your changes.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

📧 For any inquiries, reach out via email at your-email@example.com.

---

Thank you for checking out TickTask! 🎯🚀
