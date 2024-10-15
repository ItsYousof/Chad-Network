// This will be a section of the nodeJS server that handles the tweets and the database

import express from 'express';
const router = express.Router();
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, remove, push, onValue } from 'firebase/database';

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

router.post('/send_tweet', (req, res) => {
    const { sender, message } = req.body;
    const date = new Date().toISOString();
    const tweetRef = ref(database, 'tweets');
    const newTweetRef = push(tweetRef);
    
    push(tweetRef, {
        sender,
        message,
        date,
        likes: 0,
        retweets: 0,
        comments: 0,
        shares: 0,
    });
    
    res.send('Tweet sent');
});

router.get('/get_tweets', (req, res) => {
    const tweetRef = ref(database, 'tweets');
    onValue(tweetRef, (snapshot) => {
        const data = snapshot.val();
        res.json(data || {}); // Send an empty object if there's no data
    }, {
        onlyOnce: true
    });
});

router.delete('/delete_tweet/:id', async (req, res) => {
    try {
        console.log('Session:', req.session);
        console.log('Received delete request for tweet:', req.params.id);
        const { id } = req.params;
        
        if (!req.session || !req.session.username) {
            console.log('No active session found');
            return res.status(401).json({ success: false, message: 'You must be logged in to delete a tweet' });
        }
        
        const currentUser = req.session.username;
        console.log('Current user:', currentUser);

        const tweetRef = ref(database, `tweets/${id}`);
        console.log('Fetching tweet data...');
        const snapshot = await get(tweetRef);
        
        if (!snapshot.exists()) {
            console.log('Tweet not found');
            return res.status(404).json({ success: false, message: 'Tweet not found' });
        }

        const tweetData = snapshot.val();
        console.log('Tweet data:', tweetData);

        if (tweetData.sender !== currentUser) {
            console.log('Unauthorized deletion attempt');
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this tweet' });
        }

        console.log('Deleting tweet...');
        await remove(tweetRef);
        console.log('Tweet deleted successfully');
        res.json({ success: true, message: 'Tweet deleted successfully' });
    } catch (error) {
        console.error('Error deleting tweet:', error);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the tweet', error: error.message });
    }
});

router.post('/like_tweet/:id', (req, res) => {
    const { id } = req.params;
    const tweetRef = ref(database, `tweets/${id}`);
    get(tweetRef)
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                data.likes += 1;
                set(tweetRef, data);
                res.send('Tweet liked');
            } else {
                res.status(404).send('Tweet not found');
            }
        })
        .catch((error) => res.status(500).send(`Error liking tweet: ${error.message}`));
});

router.post('/add_comment/:id', (req, res) => {
    const { id } = req.params;
    const { sender, message } = req.body;
    const tweetRef = ref(database, `tweets/${id}`);
    
    get(tweetRef).then((snapshot) => {
        const tweetData = snapshot.val();
        if (tweetData) {
            if (!tweetData.comments) {
                tweetData.comments = [];
            }
            tweetData.comments.push({ sender, message });
            set(tweetRef, tweetData)
                .then(() => res.json({ success: true, message: 'Comment added successfully' }))
                .catch((error) => res.status(500).json({ success: false, message: error.message }));
        } else {
            res.status(404).json({ success: false, message: 'Tweet not found' });
        }
    }).catch((error) => {
        res.status(500).json({ success: false, message: error.message });
    });
});

router.delete('/delete_comment/:tweetId/:commentIndex', (req, res) => {
    const { tweetId, commentIndex } = req.params;
    const currentUser = req.session.username; // Assuming you're using sessions

    const tweetRef = ref(database, `tweets/${tweetId}`);
    
    get(tweetRef).then((snapshot) => {
        const tweetData = snapshot.val();
        if (tweetData && tweetData.comments && tweetData.comments[commentIndex]) {
            if (tweetData.comments[commentIndex].sender === currentUser) {
                tweetData.comments.splice(commentIndex, 1);
                set(tweetRef, tweetData)
                    .then(() => res.json({ success: true, message: 'Comment deleted successfully' }))
                    .catch((error) => res.status(500).json({ success: false, message: error.message }));
            } else {
                res.status(403).json({ success: false, message: 'You are not authorized to delete this comment' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Tweet or comment not found' });
        }
    }).catch((error) => {
        res.status(500).json({ success: false, message: error.message });
    });
});

export default router;
