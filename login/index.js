// index.js
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Middleware setup
app.use(cookieParser());
app.use(
    session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set to true if your site is served over HTTPS
    })
);
app.use(express.json());

// Sample user data (replace this with a database in a real application)
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

// Authentication middleware
const authenticateUser = (username, password) => {
    return users.find((user) => user.username === username && user.password === password);
};

// Routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = authenticateUser(username, password);

    if (user) {
        req.session.user = user;
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    // Check if the username is already taken
    if (users.some((user) => user.username === username)) {
        res.status(400).send('Username already taken');
    } else {
        const newUser = { id: users.length + 1, username, password };
        users.push(newUser);
        req.session.user = newUser;
        res.status(201).send('Signup successful');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send('Logout successful');
});

app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
