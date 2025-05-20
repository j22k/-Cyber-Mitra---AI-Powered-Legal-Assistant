/**
 * Authentication related functionality
 */

// DOM Elements
const loginForm = document.getElementById('login-form');
const landingPage = document.getElementById('landing-page');
const chatApp = document.getElementById('chat-app');

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    // You would typically make an API call here to authenticate the user
    // For demo purposes, we'll just transition to the chat app
    
    // Store user info in localStorage (for demo only - not secure)
    const userInfo = {
        name: email.split('@')[0],
        email: email,
        isLoggedIn: true,
        isPremium: true
    };
    
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    // Hide landing page, show chat app
    landingPage.style.display = 'none';
    chatApp.style.display = 'block';
    
    // Initialize user profile
    initUserProfile();
}

/**
 * Initialize user profile in sidebar
 */
function initUserProfile() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    if (userInfo.isLoggedIn) {
        const userAvatar = document.querySelector('.user-avatar');
        const userName = document.querySelector('.user-name');
        const userStatus = document.querySelector('.user-status');
        
        // Set user initials in avatar
        const nameArray = userInfo.name.split(' ');
        const initials = nameArray.length > 1 
            ? (nameArray[0][0] + nameArray[1][0]).toUpperCase() 
            : nameArray[0].substring(0, 2).toUpperCase();
            
        userAvatar.textContent = initials;
        
        // Set user name and status
        userName.textContent = capitalizeFirstLetter(userInfo.name);
        userStatus.textContent = userInfo.isPremium ? 'Premium' : 'Free';
    }
}

/**
 * Logout the user
 */
function logoutUser() {
    localStorage.removeItem('userInfo');
    chatApp.style.display = 'none';
    landingPage.style.display = 'flex';
}

/**
 * Helper function to capitalize first letter of a string
 * @param {string} string - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}