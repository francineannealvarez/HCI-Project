/* ========================================
   LOGOUT.JS - Logout Functionality
   Handles logout confirmation and redirects
   ======================================== */

// Get elements
const logoutBtn = document.getElementById('logoutBtn');
const settingsBtn = document.getElementById('settingsBtn');
const logoutDialog = document.getElementById('logoutDialog');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');

// Show logout confirmation dialog
logoutBtn.addEventListener('click', () => {
    logoutDialog.classList.remove('hidden');
});

// Cancel logout - hide dialog
cancelLogout.addEventListener('click', () => {
    logoutDialog.classList.add('hidden');
});

// Close dialog when clicking outside
logoutDialog.addEventListener('click', (e) => {
    if (e.target === logoutDialog) {
        logoutDialog.classList.add('hidden');
    }
});


// Confirm logout
confirmLogout.addEventListener('click', () => {
    // Store logout message in sessionStorage to show on login page
    sessionStorage.setItem('logoutMessage', 'Successfully logged out');
    
    // Clear any authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    
    // Redirect to login page
    window.location.href = 'login.html';
});

// Settings button - placeholder for now
settingsBtn.addEventListener('click', () => {
    alert('Settings page coming soon!');
});