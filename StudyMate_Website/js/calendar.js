/* ========================================
   STUDY CALENDAR JAVASCRIPT - Interactive Schedule 📅
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ===== DOM ELEMENTS ===== */
    
    const currentMonthEl = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const calendarDays = document.getElementById('calendarDays');
    
    const addEventBtn = document.getElementById('addEventBtn');
    const addEventCard = document.getElementById('addEventCard');
    const cancelEventBtn = document.getElementById('cancelEventBtn');
    const addEventSubmitBtn = document.getElementById('addEventSubmitBtn');
    
    const eventTitleInput = document.getElementById('eventTitleInput');
    const eventSubjectInput = document.getElementById('eventSubjectInput');
    const eventTimeInput = document.getElementById('eventTimeInput');
    const eventDateInput = document.getElementById('eventDateInput');
    const datePickerBtn = document.getElementById('datePickerBtn');
    
    const colorOptions = document.querySelectorAll('.color-option');
    const upcomingEventsList = document.getElementById('upcomingEventsList');
    
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedColor = 'purple';
    let events = [];
    let eventIdCounter = 1;
    let notificationTimeout = null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    
    /* ===== DATE PICKER MODAL ===== */
    
    function createDatePicker(onSelect) {
        const overlay = document.createElement('div');
        overlay.className = 'date-picker-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'date-picker-modal';
        
        let pickerMonth = currentMonth;
        let pickerYear = currentYear;
        let selectedDate = null;
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        function renderDatePicker() {
            modal.innerHTML = `
                <div class="date-picker-header">
                    <div class="date-picker-month" id="pickerMonthYear">${monthNames[pickerMonth]} ${pickerYear}</div>
                    <div class="date-picker-nav">
                        <button class="date-picker-nav-btn" id="pickerPrevBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <button class="date-picker-nav-btn" id="pickerNextBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="date-picker-selector" id="pickerSelector">
                    <div class="date-picker-year-header">${pickerYear}</div>
                    <div class="date-picker-months" id="pickerMonths"></div>
                    <div class="date-picker-years" id="pickerYears"></div>
                </div>
                
                <div class="date-picker-calendar" id="pickerCalendar">
                    <div class="date-picker-days-header">
                        <div class="date-picker-day-name">Su</div>
                        <div class="date-picker-day-name">Mo</div>
                        <div class="date-picker-day-name">Tu</div>
                        <div class="date-picker-day-name">We</div>
                        <div class="date-picker-day-name">Th</div>
                        <div class="date-picker-day-name">Fr</div>
                        <div class="date-picker-day-name">Sa</div>
                    </div>
                    <div class="date-picker-days" id="pickerDays"></div>
                </div>
                
                <div class="date-picker-actions">
                    <button class="date-picker-clear" id="pickerClear">Clear</button>
                    <button class="date-picker-today" id="pickerToday">Today</button>
                </div>
            `;
            
            renderCalendarDays();
            attachPickerListeners();
        }
        
        function renderCalendarDays() {
            const daysContainer = modal.querySelector('#pickerDays');
            daysContainer.innerHTML = '';
            
            const firstDay = new Date(pickerYear, pickerMonth, 1).getDay();
            const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
            const daysInPrevMonth = new Date(pickerYear, pickerMonth, 0).getDate();
            
            for (let i = firstDay - 1; i >= 0; i--) {
                const day = daysInPrevMonth - i;
                const btn = document.createElement('button');
                btn.className = 'date-picker-day other-month';
                btn.textContent = day;
                daysContainer.appendChild(btn);
            }
            
            for (let day = 1; day <= daysInMonth; day++) {
                const btn = document.createElement('button');
                btn.className = 'date-picker-day';
                btn.textContent = day;
                
                const dayDate = new Date(pickerYear, pickerMonth, day);
                dayDate.setHours(0, 0, 0, 0);
                
                if (dayDate.getTime() === today.getTime()) {
                    btn.classList.add('today');
                }
                
                if (selectedDate && selectedDate.day === day && selectedDate.month === pickerMonth && selectedDate.year === pickerYear) {
                    btn.classList.add('selected');
                }
                
                btn.addEventListener('click', function() {
                    selectedDate = { day, month: pickerMonth, year: pickerYear };
                    onSelect(day, pickerMonth, pickerYear);
                    document.body.removeChild(overlay);
                });
                
                daysContainer.appendChild(btn);
            }
            
            const totalCells = daysContainer.children.length;
            const remainingCells = 42 - totalCells;
            for (let day = 1; day <= remainingCells; day++) {
                const btn = document.createElement('button');
                btn.className = 'date-picker-day other-month';
                btn.textContent = day;
                daysContainer.appendChild(btn);
            }
        }
        
        function renderMonthYearSelector() {
            const selector = modal.querySelector('#pickerSelector');
            const calendar = modal.querySelector('#pickerCalendar');
            const monthsContainer = modal.querySelector('#pickerMonths');
            const yearsContainer = modal.querySelector('#pickerYears');
            
            selector.classList.add('active');
            calendar.classList.add('hidden');
            
            monthsContainer.innerHTML = '';
            monthNames.forEach((month, index) => {
                const btn = document.createElement('button');
                btn.className = 'date-picker-month-btn';
                btn.textContent = month.substr(0, 3);
                if (index === pickerMonth) btn.classList.add('selected');
                btn.addEventListener('click', function() {
                    pickerMonth = index;
                    selector.classList.remove('active');
                    calendar.classList.remove('hidden');
                    renderDatePicker();
                });
                monthsContainer.appendChild(btn);
            });
            
            yearsContainer.innerHTML = '';
            for (let year = 2025; year <= 2035; year++) {
                const btn = document.createElement('button');
                btn.className = 'date-picker-year-btn';
                btn.textContent = year;
                if (year === pickerYear) btn.classList.add('selected');
                btn.addEventListener('click', function() {
                    pickerYear = year;
                    modal.querySelector('.date-picker-year-header').textContent = year;
                    yearsContainer.querySelectorAll('.date-picker-year-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                });
                yearsContainer.appendChild(btn);
            }
        }
        
        function attachPickerListeners() {
            modal.querySelector('#pickerMonthYear').addEventListener('click', renderMonthYearSelector);
            
            modal.querySelector('#pickerPrevBtn').addEventListener('click', function() {
                pickerMonth--;
                if (pickerMonth < 0) {
                    pickerMonth = 11;
                    pickerYear--;
                    if (pickerYear < 2025) pickerYear = 2025;
                }
                renderDatePicker();
            });
            
            modal.querySelector('#pickerNextBtn').addEventListener('click', function() {
                pickerMonth++;
                if (pickerMonth > 11) {
                    pickerMonth = 0;
                    pickerYear++;
                }
                renderDatePicker();
            });
            
            modal.querySelector('#pickerClear').addEventListener('click', function() {
                eventDateInput.value = '';
                document.body.removeChild(overlay);
                checkEventInputs();
            });
            
            modal.querySelector('#pickerToday').addEventListener('click', function() {
                const now = new Date();
                onSelect(now.getDate(), now.getMonth(), now.getFullYear());
                document.body.removeChild(overlay);
            });
        }
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
        
        renderDatePicker();
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }
    
    
    /* ===== NOTIFICATION ===== */
    
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
    
    
    /* ===== CALENDAR RENDERING ===== */
    
    function renderCalendar() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        calendarDays.innerHTML = '';
        
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayEl = createDayElement(day, true);
            calendarDays.appendChild(dayEl);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = createDayElement(day, false);
            calendarDays.appendChild(dayEl);
        }
        
        const totalCells = calendarDays.children.length;
        const remainingCells = 42 - totalCells;
        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = createDayElement(day, true);
            calendarDays.appendChild(dayEl);
        }
        
        renderUpcomingEvents();
    }
    
    function createDayElement(day, isOtherMonth) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        
        if (isOtherMonth) {
            dayEl.classList.add('calendar-day--other-month');
        }
        
        const dayDate = new Date(currentYear, currentMonth, day);
        dayDate.setHours(0, 0, 0, 0);
        
        if (!isOtherMonth && dayDate.getTime() === today.getTime()) {
            dayEl.classList.add('calendar-day--today');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayEl.appendChild(dayNumber);
        
        if (!isOtherMonth) {
            const dayEvents = events.filter(e => 
                e.day === day && e.month === currentMonth && e.year === currentYear
            );
            
            if (dayEvents.length > 0) {
                const badgesContainer = document.createElement('div');
                badgesContainer.className = 'event-badges';
                
                const displayEvents = dayEvents.slice(0, 2);
                displayEvents.forEach(event => {
                    const badge = document.createElement('div');
                    badge.className = `event-badge event-badge--${event.color}`;
                    badge.textContent = event.title;
                    badgesContainer.appendChild(badge);
                });
                
                if (dayEvents.length > 2) {
                    const more = document.createElement('div');
                    more.className = 'event-more';
                    more.textContent = `+${dayEvents.length - 2} more`;
                    badgesContainer.appendChild(more);
                }
                
                dayEl.appendChild(badgesContainer);
            }
        }
        
        return dayEl;
    }
    
    
    /* ===== MONTH NAVIGATION ===== */
    
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    
    /* ===== ADD EVENT FORM ===== */
    
    addEventBtn.addEventListener('click', function() {
        addEventCard.classList.toggle('hidden');
        
        if (!addEventCard.classList.contains('hidden')) {
            eventTitleInput.focus();
        }
    });
    
    cancelEventBtn.addEventListener('click', function() {
        addEventCard.classList.add('hidden');
        clearEventForm();
    });
    
    
    /* ===== COLOR PICKER ===== */
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.getAttribute('data-color');
        });
    });
    
    
    /* ===== INPUT VALIDATION ===== */
    
    function checkEventInputs() {
        const titleFilled = eventTitleInput.value.trim() !== '';
        const subjectFilled = eventSubjectInput.value.trim() !== '';
        const timeFilled = eventTimeInput.value.trim() !== '';
        const dateFilled = eventDateInput.value.trim() !== '';
        
        if (titleFilled && subjectFilled && timeFilled && dateFilled) {
            addEventSubmitBtn.classList.remove('btn-disabled');
            addEventSubmitBtn.disabled = false;
        } else {
            addEventSubmitBtn.classList.add('btn-disabled');
            addEventSubmitBtn.disabled = true;
        }
    }
    
    eventTitleInput.addEventListener('input', checkEventInputs);
    eventSubjectInput.addEventListener('input', checkEventInputs);
    eventTimeInput.addEventListener('input', checkEventInputs);
    eventDateInput.addEventListener('input', checkEventInputs);
    
    
    /* ===== DATE PICKER BUTTON ===== */
    
    datePickerBtn.addEventListener('click', function() {
        createDatePicker(function(day, month, year) {
            eventDateInput.value = day;
            currentMonth = month;
            currentYear = year;
            checkEventInputs();
        });
    });
    
    
    /* ===== ADD EVENT ===== */
    
    addEventSubmitBtn.addEventListener('click', function() {
        const title = eventTitleInput.value.trim();
        const subject = eventSubjectInput.value.trim();
        const time = eventTimeInput.value.trim();
        const day = parseInt(eventDateInput.value.trim());
        
        if (!title || !subject || !time || !day) return;
        
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        if (day < 1 || day > daysInMonth) {
            showNotification('❌', `Invalid date! ${currentMonthEl.textContent} has ${daysInMonth} days.`);
            return;
        }
        
        const event = {
            id: eventIdCounter++,
            title,
            subject,
            time,
            day,
            month: currentMonth,
            year: currentYear,
            color: selectedColor
        };
        
        events.push(event);
        renderCalendar();
        showNotification('✅', 'Event added successfully!');
        
        addEventCard.classList.add('hidden');
        clearEventForm();
    });
    
    function clearEventForm() {
        eventTitleInput.value = '';
        eventSubjectInput.value = '';
        eventTimeInput.value = '';
        eventDateInput.value = '';
        checkEventInputs();
    }
    
    
    /* ===== UPCOMING EVENTS (FUTURE ONLY) ===== */
    
    function renderUpcomingEvents() {
        // Filter events for current year AND future dates only
        const yearEvents = events.filter(e => {
            const eventDate = new Date(e.year, e.month, e.day);
            eventDate.setHours(0, 0, 0, 0);
            // Only show events from today onwards
            return e.year === currentYear && eventDate.getTime() >= today.getTime();
        });
        
        if (yearEvents.length === 0) {
            upcomingEventsList.innerHTML = '<p class="text-secondary" style="text-align: center; padding: var(--spacing-xl);">No upcoming events</p>';
            return;
        }
        
        yearEvents.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            if (a.month !== b.month) return a.month - b.month;
            return a.day - b.day;
        });
        
        upcomingEventsList.innerHTML = '';
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        yearEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = `event-item event-item--${event.color}`;
            
            const dateStr = `${monthNames[event.month]} ${event.day}`;
            
            eventItem.innerHTML = `
                <div class="event-item-header">
                    <div class="event-title">${event.title}</div>
                    <button class="event-delete-btn" data-id="${event.id}">
                        <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="event-subject">${event.subject}</div>
                <div class="event-time">${event.time}</div>
                <div class="event-date">${dateStr}</div>
            `;
            
            const deleteBtn = eventItem.querySelector('.event-delete-btn');
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteEvent(event.id);
            });
            
            upcomingEventsList.appendChild(eventItem);
        });
    }
    
    function deleteEvent(eventId) {
        events = events.filter(e => e.id !== eventId);
        renderCalendar();
        showNotification('🗑️', 'Event deleted');
    }
    
    
        /* ===== SAMPLE EVENTS (DECEMBER 2025 ONLY) ===== */
    
    events = [
        // Past event in November (will show on calendar but NOT in upcoming events)
        {
            id: eventIdCounter++,
            title: 'Study Group Meeting',
            subject: 'General',
            time: '18:00 - 20:00',
            day: 29,
            month: 10, // November (0-indexed)
            year: 2025,
            color: 'purple'
        },
        {
            id: eventIdCounter++,
            title: 'Assignment Due',
            subject: 'Programming',
            time: '23:59',
            day: 30,
            month: 10, // November (0-indexed)
            year: 2025,
            color: 'orange'
        },
        // Future events in December (will show on calendar AND in upcoming events)
        {
            id: eventIdCounter++,
            title: 'Final Exam Review',
            subject: 'Mathematics',
            time: '14:00 - 16:00',
            day: 5,
            month: 11, // December (0-indexed)
            year: 2025,
            color: 'pink'
        },
        {
            id: eventIdCounter++,
            title: 'Project Presentation',
            subject: 'Human-Computer Interaction',
            time: '10:00 - 12:00',
            day: 10,
            month: 11,
            year: 2025,
            color: 'purple'
        },
        {
            id: eventIdCounter++,
            title: 'Lab Practical',
            subject: 'Physics',
            time: '09:00 - 11:00',
            day: 15,
            month: 11,
            year: 2025,
            color: 'cyan'
        },
        {
            id: eventIdCounter++,
            title: 'Essay Submission',
            subject: 'English Literature',
            time: '23:59',
            day: 20,
            month: 11,
            year: 2025,
            color: 'orange'
        },
        {
            id: eventIdCounter++,
            title: 'Group Study Session',
            subject: 'Computer Science',
            time: '15:00 - 18:00',
            day: 28,
            month: 11,
            year: 2025,
            color: 'green'
        }
    ];
    
    /* ===== INITIALIZE ===== */
    
    renderCalendar();
    
    console.log('✨ StudyMate Calendar loaded successfully!');
    console.log('📅 Calendar ready!');
    console.log('📝 Event management ready!');
});