let username = sessionStorage.getItem('currentUser');

// Function to post a tweet
function postTweet() {
    const tweetContent = document.querySelector('.tweet-box textarea').value;
    if (!tweetContent.trim()) {
        alert('Tweet cannot be empty!');
        return;
    }

    fetch('/send_tweet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender: username, message: tweetContent }),
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        document.querySelector('.tweet-box textarea').value = '';
        fetchTweets(); // Refresh the tweets after posting
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to fetch and display tweets
function fetchTweets() {
    fetch('/get_tweets')
        .then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const tweetsContainer = document.getElementById('tweets');
        tweetsContainer.innerHTML = ''; // Clear existing tweets

        if (data && Object.keys(data).length > 0) {
            for (let id in data) {
                const tweet = data[id];
                const tweetElement = createTweetElement(id, tweet);
                tweetsContainer.appendChild(tweetElement);
            }
        } else {
            tweetsContainer.innerHTML = '<p>No tweets found.</p>';
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        const tweetsContainer = document.getElementById('tweets');
        tweetsContainer.innerHTML = '<p>Error loading tweets. Please try again later.</p>';
    });
}

// Function to create a tweet element
function createTweetElement(id, tweet) {
    const tweetDiv = document.createElement('div');
    tweetDiv.className = 'tweet';
    tweetDiv.innerHTML = `
        <div class="tweet-header">
            <img src="https://via.placeholder.com/48" alt="User Avatar">
            <div class="tweet-header-info">
                <span class="name">${tweet.sender}</span>
                <span class="username">@${tweet.sender}</span>
            </div>
        </div>
        <div class="tweet-content">${tweet.message}</div>
        <div class="tweet-actions">
            <div class="tweet-action"><i class="far fa-comment"></i> ${tweet.comments}</div>
            <div class="tweet-action"><i class="fas fa-retweet"></i> ${tweet.retweets}</div>
            <div class="tweet-action" onclick="likeTweet('${id}')"><i class="far fa-heart"></i> <span class="like-count">${tweet.likes}</span></div>
            <div class="tweet-action"><i class="far fa-share-square"></i> ${tweet.shares}</div>
        </div>
    `;
    return tweetDiv;
}

// Function to like a tweet
function likeTweet(id) {
    fetch(`/like_tweet/${id}`, { method: 'POST' })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        // Update the like count in the UI
        const likeCountElement = document.querySelector(`#tweet-${id} .like-count`);
        if (likeCountElement) {
            likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to delete a tweet (for tweet owners or admins)
function deleteTweet(id) {
    fetch(`/delete_tweet/${id}`, { method: 'DELETE' })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        fetchTweets(); // Refresh the tweets after deleting
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Load tweets when the page loads
document.addEventListener('DOMContentLoaded', fetchTweets);

// Remove any existing event listeners
document.querySelector('.tweet-box button').removeEventListener('click', postTweet);

// Add the event listener
document.querySelector('.tweet-box button').addEventListener('click', postTweet);
