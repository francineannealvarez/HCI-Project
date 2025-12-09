/* ========================================
   AUTH JAVASCRIPT - Form Validation & Navigation
   Handles login and signup functionality
   ======================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons immediately
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize appropriate page
    if (document.getElementById('loginForm')) {
        initLoginPage();
    } else if (document.getElementById('signupForm')) {
        initSignupPage();
    }
});

// ===== VALIDATION FUNCTIONS =====

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateName(name) {
    return name.trim().length >= 2;
}

function validatePassword(password) {
    return password.length >= 6;
}

function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input && error) {
        input.classList.add('error');
        error.textContent = message;
        error.classList.add('show');
    }
}

function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    
    if (input && error) {
        input.classList.remove('error');
        error.textContent = '';
        error.classList.remove('show');
    }
}

function clearAllErrors() {
    const errors = document.querySelectorAll('.error-message');
    const inputs = document.querySelectorAll('input');
    
    errors.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });
    
    inputs.forEach(input => {
        input.classList.remove('error');
    });
}

// ===== PASSWORD TOGGLE =====

function setupPasswordToggle(toggleBtnId, inputId) {
    const toggleBtn = document.getElementById(toggleBtnId);
    const input = document.getElementById(inputId);
    
    if (!toggleBtn || !input) {
        console.error('Toggle button or input not found:', toggleBtnId, inputId);
        return;
    }
    
    console.log('Setting up password toggle for:', toggleBtnId);
    
    // SVG for eye (visible)
    const eyeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
    
    // SVG for eye-off (hidden)
    const eyeOffIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>';
    
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Toggle clicked for:', inputId);
        
        if (input.type === 'password') {
            input.type = 'text';
            this.innerHTML = eyeOffIcon;
            console.log('Password visible');
        } else {
            input.type = 'password';
            this.innerHTML = eyeIcon;
            console.log('Password hidden');
        }
    });
    
    console.log('Password toggle setup complete for:', toggleBtnId);
}


// ===== LOGIN PAGE =====

function initLoginPage() {
    console.log('Initializing login page...');
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }
    
    // Setup password toggle
    setupPasswordToggle('togglePassword', 'password');
    
    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        
        clearAllErrors();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        let isValid = true;
        
        // Validate email
        if (!email) {
            showError('email', 'emailError', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'emailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            showError('password', 'passwordError', 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError('password', 'passwordError', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        // If valid, redirect to dashboard
        if (isValid) {
            console.log('Form is valid, redirecting...');
            
            // Simulate loading
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i data-lucide="loader-2" style="animation: spin 1s linear infinite;"></i> Logging in...';
            submitBtn.disabled = true;
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            setTimeout(() => {
                console.log('Redirecting to dashboard...');
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    });
    
    // Clear errors on input
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const errorId = this.id + 'Error';
            clearError(this.id, errorId);
        });
    });
    
    console.log('Login page initialized successfully');
}

// ===== SIGNUP PAGE =====

function initSignupPage() {
    console.log('Initializing signup page...');
    const signupForm = document.getElementById('signupForm');
    
    if (!signupForm) {
        console.error('Signup form not found!');
        return;
    }
    
    // Setup password toggles
    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');
    
    // Handle form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Signup form submitted');
        
        clearAllErrors();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        let isValid = true;
        
        // Validate name
        if (!name) {
            showError('name', 'nameError', 'Name is required');
            isValid = false;
        } else if (!validateName(name)) {
            showError('name', 'nameError', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate email
        if (!email) {
            showError('email', 'emailError', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'emailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            showError('password', 'passwordError', 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError('password', 'passwordError', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            showError('confirmPassword', 'confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }
        
        // If valid, redirect to dashboard
        if (isValid) {
            console.log('Form is valid, redirecting...');
            
            // Simulate loading
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i data-lucide="loader-2" style="animation: spin 1s linear infinite;"></i> Creating account...';
            submitBtn.disabled = true;
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            setTimeout(() => {
                console.log('Redirecting to dashboard...');
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    });
    
    // Clear errors on input
    const inputs = signupForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const errorId = this.id + 'Error';
            clearError(this.id, errorId);
        });
    });
    
    console.log('Signup page initialized successfully');
}

// Add spinning animation for loader icon
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== CHECK FOR LOGOUT NOTIFICATION =====
window.addEventListener('DOMContentLoaded', () => {
    const logoutMessage = sessionStorage.getItem('logoutMessage');
    
    if (logoutMessage) {
        // Show notification
        showLogoutNotification(logoutMessage);
        
        // Clear the message from sessionStorage
        sessionStorage.removeItem('logoutMessage');
    }
});

// ===== SHOW LOGOUT NOTIFICATION =====
function showLogoutNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification--success';
    notification.innerHTML = `
        <div class="notification-icon">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
        <div class="notification-content">
            <div class="notification-title">${message}</div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ===== CLEAR ERROR ON INPUT =====

const formInputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');

formInputs.forEach(input => {
    input.addEventListener('input', () => {
        clearError(input.id);
    });
});