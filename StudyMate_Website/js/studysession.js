/* ========================================
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
    
    /* ===== ELEMENTS ===== */
    const modeBtns = document.querySelectorAll('.mode-btn');
    const subjectInputContainer = document.getElementById('subjectInputContainer');
    const subjectInput = document.getElementById('subjectInput');
    const modeBadge = document.getElementById('modeBadge');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerMessage = document.getElementById('timerMessage');
    const timerProgress = document.getElementById('timerProgress');
    const progressBar = document.getElementById('progressBar');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timerSettingsBtn = document.getElementById('timerSettingsBtn');
    const settingsDialog = document.getElementById('settingsDialog');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const historyList = document.getElementById('historyList');
    const tipMessage = document.getElementById('tipMessage');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    // Stats
    const sessionsTodayEl = document.getElementById('sessionsToday');
    const untilLongBreakEl = document.getElementById('untilLongBreak');
    const minutesFocusedEl = document.getElementById('minutesFocused');
    
    // Settings inputs
    const focusDurationInput = document.getElementById('focusDuration');
    const shortBreakInput = document.getElementById('shortBreakDuration');
    const longBreakInput = document.getElementById('longBreakDuration');
    const autoStartBreaksInput = document.getElementById('autoStartBreaks');
    const autoStartFocusInput = document.getElementById('autoStartFocus');
    const soundNotificationsInput = document.getElementById('soundNotifications');
    
    // Log hours inputs
    const logSubjectInput = document.getElementById('logSubjectInput');
    const hoursInput = document.getElementById('hoursInput');
    const logHoursBtn = document.getElementById('logHoursBtn');
    
    /* ===== STATE ===== */
    let currentMode = 'focus'; // 'focus', 'short', 'long'
    let timerInterval = null;
    let totalSeconds = 0;
    let remainingSeconds = 0;
    let isRunning = false;
    let hasWarned = false;
    let notificationTimeout = null;
    
    // Settings
    let settings = {
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStartBreaks: false,
        autoStartFocus: false,
        soundNotifications: true
    };
    
    // Stats
    let stats = {
        sessionsToday: 0,
        untilLongBreak: 4,
        minutesFocused: 0,
        completedFocusSessions: 0
    };
    
    const CIRCLE_CIRCUMFERENCE = 534.07; // 2 * PI * 85
    
    /* ===== MODE MESSAGES ===== */
    const modeMessages = {
        focus: [
            "Stay focused! You've got this! 💪",
            "You're doing great! Keep going! 🌟",
            "Focus time! Let's make it count! 🎯",
            "Concentrate and conquer! 🚀"
        ],
        short: [
            "Step away from the desk! 🚶",
            "Time for a quick break! ☕",
            "Stretch and relax! 🧘",
            "Take a breather! 😌"
        ],
        long: [
            "Excellent progress today! 🎉",
            "You've earned this break! 🏆",
            "Take a well-deserved rest! 😊",
            "Great work! Recharge now! ⭐"
        ]
    };
    
    /* ===== HELPER FUNCTIONS ===== */
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    function getRandomMessage(mode) {
        const messages = modeMessages[mode];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    function updateStats() {
        sessionsTodayEl.textContent = stats.sessionsToday;
        untilLongBreakEl.textContent = stats.untilLongBreak;
        minutesFocusedEl.textContent = stats.minutesFocused;
    }
    
    function showNotification(icon, text) {
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }
        
        const iconSpan = notification.querySelector('.notification-icon');
        iconSpan.textContent = icon;
        notificationText.textContent = text;
        
        notification.classList.remove('hidden');
        
        notificationTimeout = setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }
    
    function playNotificationSound() {
        if (settings.soundNotifications) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
    }
    
    /* ===== MODE SWITCHING ===== */
    
    function switchMode(mode) {
        if (isRunning) return;
        
        currentMode = mode;
        
        // Update mode buttons
        modeBtns.forEach(btn => {
            btn.classList.remove('mode-btn--active', 'mode-short', 'mode-long');
            
            if (btn.getAttribute('data-mode') === mode) {
                btn.classList.add('mode-btn--active');
                if (mode === 'short') btn.classList.add('mode-short');
                if (mode === 'long') btn.classList.add('mode-long');
            }
        });
        
        // Show/hide subject input based on mode
        if (mode === 'focus') {
            subjectInputContainer.classList.remove('hidden');
        } else {
            subjectInputContainer.classList.add('hidden');
        }
        
        // Update badge
        modeBadge.classList.remove('mode-short', 'mode-long');
        const badgeTexts = {
            focus: 'Focus Time',
            short: 'Short Break',
            long: 'Long Break'
        };
        modeBadge.querySelector('span').textContent = badgeTexts[mode];
        if (mode === 'short') modeBadge.classList.add('mode-short');
        if (mode === 'long') modeBadge.classList.add('mode-long');
        
        // Update timer circle color
        timerProgress.classList.remove('mode-short', 'mode-long');
        progressBar.classList.remove('mode-short', 'mode-long');
        if (mode === 'short') {
            timerProgress.classList.add('mode-short');
            progressBar.classList.add('mode-short');
        }
        if (mode === 'long') {
            timerProgress.classList.add('mode-long');
            progressBar.classList.add('mode-long');
        }
        
        // Set timer duration
        const durations = {
            focus: settings.focusDuration * 60,
            short: settings.shortBreakDuration * 60,
            long: settings.longBreakDuration * 60
        };
        
        totalSeconds = durations[mode];
        remainingSeconds = totalSeconds;
        hasWarned = false;
        
        updateDisplay();
        timerMessage.textContent = getRandomMessage(mode);
    }
    
    /* ===== TIMER FUNCTIONS ===== */
    
    function updateDisplay() {
        timerDisplay.textContent = formatTime(remainingSeconds);
        
        const progress = remainingSeconds / totalSeconds;
        const offset = CIRCLE_CIRCUMFERENCE * (1 - progress);
        timerProgress.style.strokeDashoffset = offset;
        
        const barProgress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
        progressBar.style.width = `${barProgress}%`;
        
        if (remainingSeconds <= 15 && remainingSeconds > 0 && !hasWarned) {
            timerProgress.classList.add('warning');
            timerMessage.textContent = '⏰ Almost done! Finish strong!';
            hasWarned = true;
        }
        
        if (remainingSeconds > 15) {
            timerProgress.classList.remove('warning');
        }
    }
    
    function startTimer() {
        // Validate subject input for focus mode
        if (currentMode === 'focus' && !subjectInput.value.trim()) {
            subjectInput.classList.add('has-error');
            timerMessage.textContent = '❌ Please enter what you\'re studying first!';
            setTimeout(() => {
                subjectInput.classList.remove('has-error');
                timerMessage.textContent = getRandomMessage('focus');
            }, 2000);
            return;
        }
        
        isRunning = true;
        
        startBtn.innerHTML = `
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
            Pause
        `;
        
        timerInterval = setInterval(() => {
            remainingSeconds--;
            updateDisplay();
            
            if (currentMode === 'focus' && remainingSeconds % 60 === 0) {
                stats.minutesFocused++;
                updateStats();
            }
            
            if (remainingSeconds <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                onTimerComplete();
            }
        }, 1000);
    }
    
    function pauseTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        
        startBtn.innerHTML = `
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start
        `;
    }
    
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        remainingSeconds = totalSeconds;
        hasWarned = false;
        
        updateDisplay();
        timerMessage.textContent = getRandomMessage(currentMode);
        
        startBtn.innerHTML = `
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start
        `;
    }
    
    function onTimerComplete() {
        playNotificationSound();
        
        if (currentMode === 'focus') {
            logStudySession();
            
            stats.sessionsToday++;
            stats.completedFocusSessions++;
            stats.untilLongBreak--;
            
            updateStats();
            
            if (stats.untilLongBreak === 0) {
                stats.untilLongBreak = 4;
                showNotification('🎉', 'Time for a long break! You earned it!');
                timerMessage.textContent = '🎉 Time for a long break! You earned it!';
                
                setTimeout(() => {
                    switchMode('long');
                    if (settings.autoStartBreaks) {
                        setTimeout(() => startTimer(), 1000);
                    }
                }, 2000);
            } else {
                showNotification('✅', 'Focus complete! Time for a short break!');
                timerMessage.textContent = '✅ Focus session complete! Take a short break!';
                
                setTimeout(() => {
                    switchMode('short');
                    if (settings.autoStartBreaks) {
                        setTimeout(() => startTimer(), 1000);
                    }
                }, 2000);
            }
            
        } else {
            showNotification('✨', 'Break over! Ready to focus again?');
            timerMessage.textContent = '✨ Break time over! Ready to focus?';
            
            setTimeout(() => {
                switchMode('focus');
                if (settings.autoStartFocus) {
                    setTimeout(() => startTimer(), 1000);
                }
            }, 2000);
        }
        
        startBtn.innerHTML = `
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start
        `;
    }
    
    function logStudySession() {
        const subject = subjectInput.value.trim();
        if (!subject) return;
        
        const minutes = Math.ceil((totalSeconds - remainingSeconds) / 60);
        if (minutes === 0) return;
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const today = new Date();
        const dateText = today.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        historyItem.innerHTML = `
            <div class="history-content">
                <p class="history-subject">${subject}</p>
                <p class="history-time">${minutes} minute${minutes !== 1 ? 's' : ''}</p>
            </div>
            <span class="history-date">${dateText}</span>
        `;
        
        // Add with animation
        historyItem.style.opacity = '0';
        historyItem.style.transform = 'translateX(-20px)';
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        setTimeout(() => {
            historyItem.style.transition = 'all 0.5s ease';
            historyItem.style.opacity = '1';
            historyItem.style.transform = 'translateX(0)';
        }, 10);
        
        // Clear subject input
        subjectInput.value = '';
    }
    
    /* ===== EVENT LISTENERS ===== */
    
    // Mode buttons
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-mode');
            switchMode(mode);
        });
    });
    
    // Start/Pause button
    startBtn.addEventListener('click', function() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
    
    // Reset button
    resetBtn.addEventListener('click', resetTimer);
    
    // Timer settings button
    timerSettingsBtn.addEventListener('click', function() {
        settingsDialog.classList.remove('hidden');
        
        focusDurationInput.value = settings.focusDuration;
        shortBreakInput.value = settings.shortBreakDuration;
        longBreakInput.value = settings.longBreakDuration;
        autoStartBreaksInput.checked = settings.autoStartBreaks;
        autoStartFocusInput.checked = settings.autoStartFocus;
        soundNotificationsInput.checked = settings.soundNotifications;
    });
    
    closeSettings.addEventListener('click', function() {
        settingsDialog.classList.add('hidden');
    });
    
    saveSettings.addEventListener('click', function() {
        settings.focusDuration = parseInt(focusDurationInput.value) || 25;
        settings.shortBreakDuration = parseInt(shortBreakInput.value) || 5;
        settings.longBreakDuration = parseInt(longBreakInput.value) || 15;
        settings.autoStartBreaks = autoStartBreaksInput.checked;
        settings.autoStartFocus = autoStartFocusInput.checked;
        settings.soundNotifications = soundNotificationsInput.checked;
        
        if (!isRunning) {
            switchMode(currentMode);
        }
        
        settingsDialog.classList.add('hidden');
        showNotification('✅', 'Settings saved successfully!');
    });
    
    settingsDialog.addEventListener('click', function(e) {
        if (e.target === settingsDialog) {
            settingsDialog.classList.add('hidden');
        }
    });
    
    /* ===== LOG STUDY HOURS ===== */
    
    function checkLogInputs() {
        const subjectFilled = logSubjectInput.value.trim() !== '';
        const hoursFilled = hoursInput.value.trim() !== '' && parseFloat(hoursInput.value) > 0;
        
        if (subjectFilled && hoursFilled) {
            logHoursBtn.classList.remove('btn-disabled');
            logHoursBtn.disabled = false;
        } else {
            logHoursBtn.classList.add('btn-disabled');
            logHoursBtn.disabled = true;
        }
    }
    
    logSubjectInput.addEventListener('input', checkLogInputs);
    hoursInput.addEventListener('input', checkLogInputs);
    
    logHoursBtn.addEventListener('click', function() {
        const subject = logSubjectInput.value.trim();
        const hours = parseFloat(hoursInput.value);
        
        if (!subject || hours <= 0) return;
        
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
        
        historyItem.style.opacity = '0';
        historyItem.style.transform = 'translateX(-20px)';
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        setTimeout(() => {
            historyItem.style.transition = 'all 0.5s ease';
            historyItem.style.opacity = '1';
            historyItem.style.transform = 'translateX(0)';
        }, 10);
        
        showNotification('🎉', 'Study session logged! Keep it up!');
        
        logSubjectInput.value = '';
        hoursInput.value = '';
        checkLogInputs();
    });
    
    /* ===== INITIALIZATION ===== */
    
    switchMode('focus');
    updateStats();
    
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
    
    console.log('✨ StudyMate Study Sessions loaded successfully!');
});