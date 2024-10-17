import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, remove, push } from 'firebase/database';
import bcrypt from 'bcrypt';
import tweetsRouter from './tweets.js';  // Make sure this path is correct
import session from 'express-session';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPbJrbz-QBUw8aY2kvZLi-h4rVDDV26_A",
    authDomain: "atcchatpopup.firebaseapp.com",
    databaseURL: "https://atcchatpopup-default-rtdb.firebaseio.com",
    projectId: "atcchatpopup",
    storageBucket: "atcchatpopup.appspot.com",
    messagingSenderId: "495140373446",
    appId: "1:495140373446:web:d127215cab6676793d68c7",
    measurementId: "G-LWLS6C06R2"
};

const app = express();
const PORT = 6060;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // set to true if using https
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Signup route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userRef = ref(db, 'users/' + username);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            res.json({ success: false, message: 'Username already exists' });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await set(userRef, { password: hashedPassword });
            res.json({ success: true });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

app.get('/cool', (req, res) => {
    res.send('school is kinda nice, no? but this website is still in development, so please be patient.SIKE I DONT CARE!!!');
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userRef = ref(db, 'users/' + username);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const match = await bcrypt.compare(password, userData.password);
            if (match) {
                req.session.username = username;
                req.session.save(err => {
                    if (err) {
                        console.error('Session save error:', err);
                        return res.json({ success: false, message: 'Login failed' });
                    }
                    console.log('Session saved:', req.session);
                    res.json({ success: true, username: username });
                });
            } else {
                res.json({ success: false, message: 'Invalid password' });
            }
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.json({ success: false, message: error.message });
    }
});

// Change password route
app.post('/change-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    // In a real application, you'd get the username from the session
    const username = 'testuser'; // Replace with actual logged-in user

    try {
        const userRef = ref(db, 'users/' + username);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            const match = await bcrypt.compare(currentPassword, userData.password);
            if (match) {
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                await set(userRef, { password: hashedNewPassword });
                res.json({ success: true });
            } else {
                res.json({ success: false, message: 'Current password is incorrect' });
            }
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Account deletion route
app.post('/delete-account', async (req, res) => {
    // In a real application, you'd get the username from the session
    const username = 'testuser'; // Replace with actual logged-in user

    try {
        const userRef = ref(db, 'users/' + username);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            await remove(userRef);
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Fetch all users
app.get('/users', async (req, res) => {
    try {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            res.json({ success: true, users: snapshot.val() });
        } else {
            res.json({ success: false, message: 'No users found' });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Use the tweets router
app.use(tweetsRouter);

// Add a logout route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.json({ success: false, message: 'Failed to logout' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

app.get('/check-session', (req, res) => {
    if (req.session.username) {
        res.json({ loggedIn: true, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

// Admin routes
app.get('/admin/users', async (req, res) => {
    try {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            const users = Object.entries(snapshot.val()).map(([username, data]) => ({
                username,
                password: data.password // Note: This is returning the hashed password
            }));
            res.json({ success: true, users });
        } else {
            res.json({ success: false, message: 'No users found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/admin/tweets', async (req, res) => {
    try {
        const tweetsRef = ref(db, 'tweets');
        const snapshot = await get(tweetsRef);
        if (snapshot.exists()) {
            const tweets = Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data }));
            res.json({ success: true, tweets });
        } else {
            res.json({ success: false, message: 'No tweets found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/admin/comments', async (req, res) => {
    try {
        const tweetsRef = ref(db, 'tweets');
        const snapshot = await get(tweetsRef);
        if (snapshot.exists()) {
            const comments = [];
            Object.entries(snapshot.val()).forEach(([tweetId, tweetData]) => {
                if (tweetData.comments) {
                    tweetData.comments.forEach((comment, index) => {
                        comments.push({ id: `${tweetId}-${index}`, tweetId, ...comment });
                    });
                }
            });
            res.json({ success: true, comments });
        } else {
            res.json({ success: false, message: 'No comments found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add these routes after your existing admin routes

// Edit user
app.put('/admin/users/:username', async (req, res) => {
    const oldUsername = req.params.username;
    const { newUsername } = req.body;
    try {
        const oldUserRef = ref(db, `users/${oldUsername}`);
        const newUserRef = ref(db, `users/${newUsername}`);
        const snapshot = await get(oldUserRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            await set(newUserRef, userData);
            await remove(oldUserRef);
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete user
app.delete('/admin/users/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const userRef = ref(db, `users/${username}`);
        await remove(userRef);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Edit tweet
app.put('/admin/tweets/:id', async (req, res) => {
    const tweetId = req.params.id;
    const { message } = req.body;
    try {
        const tweetRef = ref(db, `tweets/${tweetId}`);
        const snapshot = await get(tweetRef);
        if (snapshot.exists()) {
            const tweetData = snapshot.val();
            tweetData.message = message;
            await set(tweetRef, tweetData);
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Tweet not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete tweet
app.delete('/admin/tweets/:id', async (req, res) => {
    const tweetId = req.params.id;
    try {
        const tweetRef = ref(db, `tweets/${tweetId}`);
        await remove(tweetRef);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Edit comment
app.put('/admin/comments/:id', async (req, res) => {
    const [tweetId, commentIndex] = req.params.id.split('-');
    const { message } = req.body;
    try {
        const tweetRef = ref(db, `tweets/${tweetId}`);
        const snapshot = await get(tweetRef);
        if (snapshot.exists()) {
            const tweetData = snapshot.val();
            if (tweetData.comments && tweetData.comments[commentIndex]) {
                tweetData.comments[commentIndex].message = message;
                await set(tweetRef, tweetData);
                res.json({ success: true });
            } else {
                res.json({ success: false, message: 'Comment not found' });
            }
        } else {
            res.json({ success: false, message: 'Tweet not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete comment
app.delete('/admin/comments/:id', async (req, res) => {
    const [tweetId, commentIndex] = req.params.id.split('-');
    try {
        const tweetRef = ref(db, `tweets/${tweetId}`);
        const snapshot = await get(tweetRef);
        if (snapshot.exists()) {
            const tweetData = snapshot.val();
            if (tweetData.comments && tweetData.comments[commentIndex]) {
                tweetData.comments.splice(commentIndex, 1);
                await set(tweetRef, tweetData);
                res.json({ success: true });
            } else {
                res.json({ success: false, message: 'Comment not found' });
            }
        } else {
            res.json({ success: false, message: 'Tweet not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/admin/users/:username/reset-password', async (req, res) => {
    const username = req.params.username;
    const { newPassword } = req.body;
    try {
        const userRef = ref(db, `users/${username}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await set(userRef, { ...snapshot.val(), password: hashedPassword });
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/admin/check-status', (req, res) => {
    if (req.session.user && req.session.user.isAdmin) {
        res.json({ isAdmin: true });
    } else {
        res.json({ isAdmin: false });
    }
});

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userRef = ref(db, `users/${username}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.isAdmin && await bcrypt.compare(password, userData.password)) {
                req.session.user = { username, isAdmin: true };
                res.json({ success: true });
            } else {
                res.json({ success: false, message: 'Invalid credentials or not an admin' });
            }
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});