function getCurrentUsername() {
    return sessionStorage.getItem('currentUser') || 'Anonymous';
}

// Function to post a tweet
function postTweet() {
    const tweetContent = document.querySelector('.tweet-box textarea').value;
    if (!tweetContent.trim()) {
        alert('Tweet cannot be empty!');
        return;
    }

    const username = getCurrentUsername();

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
    const currentUser = getCurrentUsername();
    const tweetDiv = document.createElement('div');
    tweetDiv.className = 'tweet';
    tweetDiv.id = `tweet-${id}`;

    const heartIconClass = likedTweets[id] ? 'fas' : 'far';

    tweetDiv.innerHTML = `
        <div class="tweet-header">
            <img src="https://via.placeholder.com/48" alt="User Avatar">
            <div class="tweet-header-info">
                <span class="name">${tweet.sender || 'Anonymous'}</span>
                <span class="username">@${tweet.sender || 'anonymous'}</span>
            </div>
            ${tweet.sender === currentUser ? `
                <button class="delete-tweet" onclick="deleteTweet('${id}')">
                    <i class="fas fa-trash"></i>
                </button>
            ` : ''}
        </div>
        <div class="tweet-content">${tweet.message}</div>
        <div class="tweet-actions">
            <div class="tweet-action" onclick="toggleComments('${id}')"><i class="far fa-comment"></i> <span class="comment-count">${tweet.comments ? tweet.comments.length : 0}</span></div>
            <div class="tweet-action"><i class="fas fa-retweet"></i> ${tweet.retweets || 0}</div>
            <div class="tweet-action" onclick="likeTweet('${id}')"><i class="${heartIconClass} fa-heart"></i> <span class="like-count">${tweet.likes || 0}</span></div>
            <div class="tweet-action"><i class="far fa-share-square"></i> ${tweet.shares || 0}</div>
        </div>
        <div class="comments-section" style="display: none;">
            <div class="comments-list">
                ${tweet.comments ? tweet.comments.map((comment, index) => `
                    <div class="comment">
                        <strong>${comment.sender}:</strong> ${comment.message}
                        ${comment.sender === currentUser ? `
                            <button class="delete-comment" onclick="deleteComment('${id}', ${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                `).join('') : ''}
            </div>
            <div class="comment-input-container">
                <input type="text" class="comment-input" placeholder="Add a comment...">
                <button onclick="addComment('${id}')">Comment</button>
            </div>
        </div>
    `;
    return tweetDiv;
}

// Function to like a tweet
function likeTweet(id) {
    if (likedTweets[id]) {
        console.log('You have already liked this tweet');
        return;
    }

    fetch(`/like_tweet/${id}`, { method: 'POST' })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        // Update the like count in the UI
        const likeCountElement = document.querySelector(`#tweet-${id} .like-count`);
        if (likeCountElement) {
            likeCountElement.textContent = parseInt(likeCountElement.textContent) + 1;
            likedTweets[id] = true;
            // Change the heart icon to solid
            const heartIcon = document.querySelector(`#tweet-${id} .fa-heart`);
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Function to delete a tweet (for tweet owners or admins)
function deleteTweet(id) {
    checkSession().then(loggedIn => {
        if (!loggedIn) {
            alert('You must be logged in to delete a tweet');
            // Redirect to login page or show login modal
            return;
        }
        
        if (confirm('Are you sure you want to delete this tweet?')) {
            console.log('Deleting tweet:', id);
            fetch(`/delete_tweet/${id}`, { method: 'DELETE' })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                if (data.success) {
                    console.log('Tweet deleted successfully');
                    fetchTweets(); // Refresh the tweets after deleting
                } else {
                    console.error('Failed to delete tweet:', data.message);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    });
}

// Add this object to keep track of liked tweets
const likedTweets = {};

// Add this function to handle commenting
function addComment(id) {
    const commentInput = document.querySelector(`#tweet-${id} .comment-input`);
    const commentText = commentInput.value.trim();
    if (!commentText) {
        alert('Comment cannot be empty!');
        return;
    }

    const username = getCurrentUsername();

    fetch(`/add_comment/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender: username, message: commentText }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Comment added:', data);
        commentInput.value = '';
        fetchTweets(); // Refresh the tweets to show the new comment
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Add this function to toggle comments visibility
function toggleComments(id) {
    const commentsSection = document.querySelector(`#tweet-${id} .comments-section`);
    commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
}

// Load tweets when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchTweets();
    document.querySelector('.tweet-box button').addEventListener('click', postTweet);
});

function deleteComment(tweetId, commentIndex) {
    if (confirm('Are you sure you want to delete this comment?')) {
        fetch(`/delete_comment/${tweetId}/${commentIndex}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Comment deleted successfully');
                fetchTweets(); // Refresh the tweets after deleting
            } else {
                console.error('Failed to delete comment:', data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

function checkSession() {
    return fetch('/check-session')
        .then(response => response.json())
        .then(data => {
            console.log('Session status:', data);
            return data.loggedIn;
        });
}
