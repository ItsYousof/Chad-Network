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

router.delete('/delete_tweet/:id', (req, res) => {
    const { id } = req.params;
    const tweetRef = ref(database, `tweets/${id}`);
    remove(tweetRef)
        .then(() => res.send('Tweet deleted'))
        .catch((error) => res.status(500).send(`Error deleting tweet: ${error.message}`));
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



export default router;
