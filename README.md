# OnlyFriends Chat App

A real-time full-stack chat application built using the MERN stack with WebRTC support for audio/video calling, group chats, and instant messaging.

---

## Website Link

https://onlyfriends-chat-app.vercel.app/

---

## 🚀 Features

* 🔐 User Authentication (Login / Register)
* 💬 Real-time One-to-One Chat
* 👥 Group Chat Support
* 📞 Audio Calling using WebRTC
* 🎥 Video Calling using WebRTC
* 🟢 Online / Offline User Status
* ✉️ Last Message Preview
* 📷 Profile Picture Upload
* ⚡ Real-time Messaging using Socket.IO
* ☁️ Cloud-based Deployment

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* Socket.IO Client
* WebRTC APIs

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* JWT Authentication
* bcrypt.js

---

## 📂 Project Structure

```bash
OnlyFriends-Chat-App/
│
├── frontend/          # React Frontend
├── backend/           # Express Backend
│
├── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend folder.

### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret
```

Create a `.env` file inside the frontend folder.

### Frontend `.env`

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## 📦 Installation

### Clone the repository

```bash
git clone https://github.com/your-username/OnlyFriends-Chat-App.git
```

### Go to project folder

```bash
cd OnlyFriends-Chat-App
```

### Install backend dependencies

```bash
cd backend
npm install
```

### Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## ▶️ Run the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 🌐 Deployment

### Frontend

Deployed on Vercel

### Backend

Deployed on Render

---

## 🔄 WebRTC Flow

1. User starts a call
2. SDP Offer is created
3. Offer sent through Socket.IO signaling server
4. Receiver sends SDP Answer
5. ICE Candidates exchanged
6. Peer-to-peer media connection established

---

## 🧠 Learning Outcomes

This project helped in understanding:

* MERN Stack Development
* Real-time communication
* WebRTC internals
* Socket.IO signaling
* Authentication & Authorization
* State Management
* Deployment process

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Create a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Suman Kumar

GitHub: https://github.com/SumanKumar-git
