const express = require('express');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const app = express();
const nodemailer = require("nodemailer");

//Enable CORS
const cors = require("cors");

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://task-flow-frontend-asq6b3d6y-code-with-bharats-projects.vercel.app/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
//Middleware to parse JSON bodies
app.use(express.json());

const secretkey = process.env.JWT_SECRET;

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));


//User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

//User Model
const userModel = mongoose.model('User', userSchema);

//email notification on signup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//SignUp Route
app.post('/signup', async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        const existingUser = await userModel.findOne({
            username: req.body.username
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Username already exists'
            });
        }

        const newUser = new userModel({
            username: req.body.username,
            password: req.body.password
        });

        await newUser.save();

        //send email
        await transporter.sendMail({
            from: "choudharybharat0102@gmail.com",
            to: req.body.username,
            subject: "🎉 Welcome to TaskFlow!",
            html: `
    <div style="font-family: Arial; padding: 20px;">
        <h2 style="color:#4CAF50;">Welcome to TaskFlow 🚀</h2>
        
        <p>Hi there 👋,</p>
        
        <p>We're excited to have you onboard!</p>
        
        <ul>
            <li>✔ Manage your tasks</li>
            <li>✔ Stay productive</li>
            <li>✔ Track your progress</li>
        </ul>
        
        <p>Start your journey today 💪</p>

        <hr/>
        <p style="font-size:12px; color:gray;">
            If you didn’t sign up, please ignore this email.
        </p>
    </div>
    `
        });
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

//Authentication Middleware
function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secretkey);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: err.message });
    }
}

//Login Route
app.post('/login', async (req, res) => {
    try {
        const userInfo = await userModel.findOne({
            username: req.body.username
        });

        if (!userInfo || userInfo.password !== req.body.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: userInfo._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        await transporter.sendMail({
            from: "choudharybharat0102@gmail.com",
            to: userInfo.username,
            subject: "👋 Welcome back to TaskFlow",
            html: `
    <div style="font-family: Arial; padding: 20px;">
        <h2>Welcome back to TaskFlow 👋</h2>

        <p>We're glad to see you again 😊</p>

        <p>Your tasks are waiting — let's get productive 🚀</p>

        <hr/>
        <p style="font-size:12px; color:gray;">
            If this wasn't you, please secure your account.
        </p>
    </div>
    `
        });

        res.json({ token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

//Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        default: 'pending'
    },
    priority: {
        type: String,
        default: 'medium'
    },
    userId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Task Model
const Task = mongoose.model("Task", taskSchema);

//Create Task Route
app.post('/tasks', auth, async (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({
            message: 'Title is required'
        });
    }
    const newTask = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        userId: req.userId
    });
    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
});

//Get Tasks Route
app.get('/tasks', auth, async (req, res) => {
    const tasks = await Task.find({ userId: req.userId });
    res.json({ message: 'Tasks retrieved successfully', tasks });
});

//update Tast route
app.put('/tasks/:id', auth, async (req, res) => {
    const taskId = req.params.id;
    const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, userId: req.userId }, req.body, { new: true });
    if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully', task: updatedTask });
});

//Delete Task Route
app.delete('/tasks/:id', auth, async (req, res) => {
    const taskId = req.params.id;
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId: req.userId });
    if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', task: deletedTask });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

