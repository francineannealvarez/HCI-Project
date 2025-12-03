 e/* ========================================
   STUDY SESSION JAVASCRIPT - Complete Logic ⏱️
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ===== TAB SWITCHING ===== */
    const tabs = document.querySelectorAll('.session-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('session-tab--active'));
            tabContents.forEach(tc => tc.classList.remove('tab-content--active'));
            
            // Add active class to clicked tab
            this.classList.add('session-tab--active');
            
            // Show corresponding content
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.add('tab-content--active');
            }
        });
    });
    
    
    /* ===== POMODORO TIMER ===== */
    
    let timerInterval = null;
    let totalSeconds = 0;
    let remainingSeconds = 0;
    let isRunning = false;
    let hasWarned = false;
    
    const timerDisplay = document.getElementById('timerDisplay');
    const timerProgress = document.getElementById('timerProgress');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const customInputContainer = document.getElementById('customInputContainer');
    const customTimeInput = document.getElementById('customTimeInput');
    const setCustomTimeBtn = document.getElementById('setCustomTime');
    
    const CIRCLE_CIRCUMFERENCE = 534.07; // 2 * PI * 85
    
    // Format time display
    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    // Update timer display
    function updateDisplay() {
        timerDisplay.textContent = formatTime(remainingSeconds);
        
        // Update circle progress
        const progress = remainingSeconds / totalSeconds;
        const offset = CIRCLE_CIRCUMFERENCE * (1 - progress);
        timerProgress.style.strokeDashoffset = offset;
        
        // Turn red when 15 seconds or less
        if (remainingSeconds <= 15 && remainingSeconds > 0) {
            timerProgress.classList.add('warning');
            
            // Show warning notification once
            if (!hasWarned) {
                showNotification('⚠️', 'Almost done! 15 seconds left!');
                hasWarned = true;
            }
        } else {
            timerProgress.classList.remove('warning');
        }
    }
    
    // Set timer
    function setTimer(seconds) {
        if (isRunning) return;
        
        totalSeconds = seconds;
        remainingSeconds = seconds;
        hasWarned = false;
        updateDisplay();
        
        // Enable reset button
        resetBtn.classList.remove('btn-disabled');
        resetBtn.disabled = false;
    }
    
    // Start/Pause timer
    function toggleTimer() {
        if (remainingSeconds === 0) {
            showNotification('❌', 'Please set a time first!');
            return;
        }
        
        if (isRunning) {
            // Pause
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.innerHTML = `
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Start
            `;
        } else {
            // Start
            isRunning = true;
            startBtn.innerHTML = `
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                Pause
            `;
            
            showNotification('▶️', 'Timer started!');
            
            timerInterval = setInterval(() => {
                remainingSeconds--;
                updateDisplay();
                
                if (remainingSeconds <= 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    startBtn.innerHTML = `
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Start
                    `;
                    showNotification('⏰', 'Time\'s up! Great work!');
                }
            }, 1000);
        }
    }
    
    // Reset timer
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        remainingSeconds = totalSeconds;
        hasWarned = false;
        updateDisplay();
        startBtn.innerHTML = `
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start
        `;
    }
    
    // Preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const minutes = this.getAttribute('data-minutes');
            
            if (minutes === 'custom') {
                customInputContainer.classList.toggle('hidden');
            } else {
                customInputContainer.classList.add('hidden');
                setTimer(parseInt(minutes) * 60);
            }
        });
    });
    
    // Custom time input - Segmented input (HH : MM : SS)
    const hoursSegment = document.getElementById('hoursSegment');
    const minutesSegment = document.getElementById('minutesSegment');
    const secondsSegment = document.getElementById('secondsSegment');
    const timeSegments = [hoursSegment, minutesSegment, secondsSegment];
    
    // Select all on focus
    timeSegments.forEach(segment => {
        segment.addEventListener('focus', function() {
            this.select();
        });
        
        // Only allow digits
        segment.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            
            // Limit to 2 digits
            if (value.length > 2) {
                value = value.slice(0, 2);
            }
            
            // For minutes and seconds, max is 59
            if (this !== hoursSegment) {
                const num = parseInt(value) || 0;
                if (num > 59) {
                    value = '59';
                }
            }
            
            e.target.value = value;
            
            // Auto-jump to next field if 2 digits entered
            if (value.length === 2) {
                const currentIndex = timeSegments.indexOf(this);
                if (currentIndex < timeSegments.length - 1) {
                    timeSegments[currentIndex + 1].focus();
                    timeSegments[currentIndex + 1].select();
                }
            }
        });
        
        // Handle backspace - jump to previous field if empty
        segment.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '') {
                const currentIndex = timeSegments.indexOf(this);
                if (currentIndex > 0) {
                    timeSegments[currentIndex - 1].focus();
                    timeSegments[currentIndex - 1].select();
                }
            }
        });
        
        // Pad with zero on blur if single digit
        segment.addEventListener('blur', function() {
            if (this.value.length === 1) {
                this.value = '0' + this.value;
            } else if (this.value === '') {
                this.value = '00';
            }
        });
    });
    
    setCustomTimeBtn.addEventListener('click', function() {
        const hours = parseInt(hoursSegment.value) || 0;
        const minutes = parseInt(minutesSegment.value) || 0;
        const seconds = parseInt(secondsSegment.value) || 0;
        
        const totalSecs = hours * 3600 + minutes * 60 + seconds;
        
        if (totalSecs === 0) {
            showNotification('❌', 'Time must be greater than 0!');
            return;
        }
        
        setTimer(totalSecs);
        customInputContainer.classList.add('hidden');
        showNotification('✅', 'Custom time set!');
    });
    
    // Button event listeners
    startBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    
    /* ===== LOG STUDY HOURS ===== */
    
    const subjectInput = document.getElementById('subjectInput');
    const hoursInput = document.getElementById('hoursInput');
    const logHoursBtn = document.getElementById('logHoursBtn');
    const historyList = document.getElementById('historyList');
    
    // Enable/disable Log Hours button based on inputs
    function checkLogInputs() {
        const subjectFilled = subjectInput.value.trim() !== '';
        const hoursFilled = hoursInput.value.trim() !== '' && parseFloat(hoursInput.value) > 0;
        
        if (subjectFilled && hoursFilled) {
            logHoursBtn.classList.remove('btn-disabled');
            logHoursBtn.disabled = false;
        } else {
            logHoursBtn.classList.add('btn-disabled');
            logHoursBtn.disabled = true;
        }
    }
    
    subjectInput.addEventListener('input', checkLogInputs);
    hoursInput.addEventListener('input', checkLogInputs);
    
    // Log hours
    logHoursBtn.addEventListener('click', function() {
        const subject = subjectInput.value.trim();
        const hours = parseFloat(hoursInput.value);
        
        if (!subject || hours <= 0) return;
        
        // Create new history item
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const timeText = hours >= 1 
            ? `${hours} hour${hours !== 1 ? 's' : ''}`
            : `${Math.round(hours * 60)} minutes`;
        
        const today = new Date();
        const dateText = today.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        historyItem.innerHTML = `
            <div class="history-content">
                <p class="history-subject">${subject}</p>
                <p class="history-time">${timeText}</p>
            </div>
            <span class="history-date">${dateText}</span>
        `;
        
        // Add to top of history list with animation
        historyItem.style.opacity = '0';
        historyItem.style.transform = 'translateX(-20px)';
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        setTimeout(() => {
            historyItem.style.transition = 'all 0.5s ease';
            historyItem.style.opacity = '1';
            historyItem.style.transform = 'translateX(0)';
        }, 10);
        
        // Show notification
        showNotification('🎉', 'Study session logged! Keep it up!');
        
        // Clear inputs
        subjectInput.value = '';
        hoursInput.value = '';
        checkLogInputs();
    });
    
    
    /* ===== NOTIFICATION SYSTEM ===== */
    
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    let notificationTimeout = null;
    
    function showNotification(icon, text) {
        // Clear existing timeout
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }
        
        // Update notification
        const iconSpan = notification.querySelector('.notification-icon');
        iconSpan.textContent = icon;
        notificationText.textContent = text;
        
        // Show notification
        notification.classList.remove('hidden');
        
        // Hide after 3 seconds
        notificationTimeout = setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }
    
    
    /* ===== ACTIVITY ANIMATIONS ===== */
    
    const historyItems = document.querySelectorAll('.history-item');
    
    historyItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
    
    
    /* ===== LOG LOADED MESSAGE ===== */
    console.log('✨ StudyMate Study Sessions loaded successfully!');
    console.log('⏱️ Pomodoro timer ready!');
    console.log('📝 Log study hours ready!');
});