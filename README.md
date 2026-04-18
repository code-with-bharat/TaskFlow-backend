# 🚀 TaskFlow Backend

Backend API for TaskFlow built using **Node.js, Express, MongoDB**.

---

## 🌐 Live API

https://taskflow-backend-t0g7.onrender.com

---

## ✨ Features

* 🔐 JWT Authentication
* 👤 Signup & Login
* 📧 Email notifications (Gmail + Nodemailer)
* 📋 Task CRUD APIs
* 🔒 Protected routes

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB Atlas (Mongoose)
* JWT
* Nodemailer
* Render (Deployment)

---

# ⚙️ RUN LOCALLY

## 1️⃣ Clone Repo

```bash
git clone https://github.com/your-username/taskflow-backend.git
cd taskflow-backend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create `.env` file

Create a `.env` file in root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

# 🔑 IMPORTANT SETUP

## MongoDB

* Use MongoDB Atlas
* Allow access:

```text
0.0.0.0/0
```

---

## Gmail Setup (VERY IMPORTANT)

You must:

* Enable **2-Step Verification**
* Generate **App Password**

Use that password here:

```env
EMAIL_PASS=your_app_password
```

---

## 4️⃣ Run Server

```bash
node server.js
```

---

## 🌍 Server runs on:

```text
http://localhost:3000
```

---

# 🔗 API ENDPOINTS

## Auth

* POST `/signup`
* POST `/login`

## Tasks (Protected)

* GET `/tasks`
* POST `/tasks`
* PUT `/tasks/:id`
* DELETE `/tasks/:id`

---

# ⚠️ IMPORTANT (FOR LOCAL FRONTEND)

If frontend runs locally:

Update backend CORS:

```js
app.use(cors({
  origin: "http://localhost:3000"
}));
```

---

# 🔧 Common Issues

### ❌ MongoDB connection error

→ Check IP whitelist

### ❌ Email not sending

→ Check App Password

### ❌ CORS error

→ Check allowed origins

---

# 🚀 Future Improvements

* 🔐 Password hashing (bcrypt)
* 📅 Due date reminders
* 📊 Analytics
* 🔔 Notification system

---

# 👨‍💻 Author

Bharat Choudhary
