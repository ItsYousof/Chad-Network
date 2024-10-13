import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, remove, push } from 'firebase/database';
import bcrypt from 'bcrypt';
import tweetsRouter from './tweets.js';  // Make sure this path is correct

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
                res.json({ success: true, username: username });
            } else {
                res.json({ success: false, message: 'Invalid password' });
            }
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
