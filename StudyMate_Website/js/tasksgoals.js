/* ========================================
   TASKS & GOALS JAVASCRIPT - Interactive To-Do ✅
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ===== DOM ELEMENTS ===== */
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addTaskForm = document.getElementById('addTaskForm');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');
    const addTaskSubmitBtn = document.getElementById('addTaskSubmitBtn');
    
    const taskTitleInput = document.getElementById('taskTitleInput');
    const taskSubjectInput = document.getElementById('taskSubjectInput');
    const taskDateInput = document.getElementById('taskDateInput');
    
    const taskList = document.getElementById('taskList');
    const tasksCount = document.getElementById('tasksCount');
    
    const progressPercentage = document.getElementById('progressPercentage');
    const progressBarFill = document.getElementById('progressBarFill');
    const weeklyCount = document.getElementById('weeklyCount');
    const pendingCount = document.getElementById('pendingCount');
    const completedTodayCount = document.getElementById('completedTodayCount');
    
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    let taskIdCounter = 6;
    let notificationTimeout = null;

    addTaskSubmitBtn.classList.add('btn-disabled');
    addTaskSubmitBtn.disabled = true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    
    /* ===== DATE PICKER MODAL ===== */
    
    function createDatePicker(onSelect) {
        const overlay = document.createElement('div');
        overlay.className = 'date-picker-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'date-picker-modal';
        
        const currentDate = new Date();
        let pickerMonth = currentDate.getMonth();
        let pickerYear = currentDate.getFullYear();
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
                    const dateObj = new Date(pickerYear, pickerMonth, day);
                    const formatted = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
                    onSelect(formatted);
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
                taskDateInput.value = '';
                document.body.removeChild(overlay);
                checkAddTaskInputs();
            });
            
            modal.querySelector('#pickerToday').addEventListener('click', function() {
                const now = new Date();
                const formatted = now.toISOString().split('T')[0];
                onSelect(formatted);
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
    
    
    /* ===== SHOW NOTIFICATION ===== */
    
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
    
    
    /* ===== CALCULATE STATS ===== */
    
    function updateStats() {
        const allTasks = document.querySelectorAll('.task-item');
        const completedTasks = document.querySelectorAll('.task-item--completed');
        
        const totalTasks = allTasks.length;
        const completedCount = completedTasks.length;
        const pendingTasksCount = totalTasks - completedCount;
        
        tasksCount.textContent = `${completedCount} of ${totalTasks} tasks completed`;
        
        const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
        progressPercentage.textContent = `${percentage}%`;
        progressBarFill.style.width = `${percentage}%`;
        
        weeklyCount.textContent = `${completedCount} task${completedCount !== 1 ? 's' : ''} completed`;
        
        pendingCount.textContent = pendingTasksCount;
        completedTodayCount.textContent = completedCount;
    }
    
    /* ===== ADD TASK FORM TOGGLE ===== */
    
    addTaskBtn.addEventListener('click', function() {
        addTaskForm.classList.toggle('hidden');
        
        // Toggle the active state class
        if (!addTaskForm.classList.contains('hidden')) {
            addTaskBtn.classList.add('form-active');
            taskTitleInput.focus();
        } else {
            addTaskBtn.classList.remove('form-active');
        }
    });
    
    cancelTaskBtn.addEventListener('click', function() {
        addTaskForm.classList.add('hidden');
        addTaskBtn.classList.remove('form-active');
        
        taskTitleInput.value = '';
        taskSubjectInput.value = '';
        taskDateInput.value = '';
        
        checkAddTaskInputs();
    });
    
    /* ===== DATE PICKER FOR TASK DATE ===== */
    
    taskDateInput.addEventListener('click', function() {
        createDatePicker(function(formattedDate) {
            taskDateInput.value = formattedDate;
            checkAddTaskInputs();
        });
    });
    
    
    /* ===== INPUT VALIDATION (CONSTRAINT) ===== */
    
    function checkAddTaskInputs() {
        const titleFilled = taskTitleInput.value.trim() !== '';
        const subjectFilled = taskSubjectInput.value.trim() !== '';
        const dateFilled = taskDateInput.value.trim() !== '';
        
        if (titleFilled && subjectFilled && dateFilled) {
            addTaskSubmitBtn.classList.remove('btn-disabled');
            addTaskSubmitBtn.disabled = false;
        } else {
            addTaskSubmitBtn.classList.add('btn-disabled');
            addTaskSubmitBtn.disabled = true;
        }
    }
    
    taskTitleInput.addEventListener('input', checkAddTaskInputs);
    taskSubjectInput.addEventListener('input', checkAddTaskInputs);
    taskDateInput.addEventListener('input', checkAddTaskInputs);
    
    
    /* ===== ADD NEW TASK ===== */
    
    addTaskSubmitBtn.addEventListener('click', function() {
        const title = taskTitleInput.value.trim();
        const subject = taskSubjectInput.value.trim();
        const dateValue = taskDateInput.value;
        
        if (!title || !subject || !dateValue) return;
        
        const dateObj = new Date(dateValue);
        const dateFormatted = dateObj.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.setAttribute('data-task-id', taskIdCounter++);
        
        taskItem.innerHTML = `
            <label class="task-checkbox-container">
                <input type="checkbox" class="task-checkbox">
                <span class="checkbox-custom"></span>
            </label>
            <div class="task-content">
                <p class="task-title">${title}</p>
                <div class="task-meta">
                    <span class="task-subject">${subject}</span>
                    <span class="task-date">${dateFormatted}</span>
                </div>
            </div>
            <button class="task-delete-btn">
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        `;
        
        taskItem.style.opacity = '0';
        taskItem.style.transform = 'translateX(-20px)';
        taskList.insertBefore(taskItem, taskList.firstChild);
        
        setTimeout(() => {
            taskItem.style.transition = 'all 0.5s ease';
            taskItem.style.opacity = '1';
            taskItem.style.transform = 'translateX(0)';
        }, 10);
        
        attachTaskEventListeners(taskItem);
        updateStats();
        showNotification('✅', 'Task added successfully!');
        
        addTaskForm.classList.add('hidden');
        taskTitleInput.value = '';
        taskSubjectInput.value = '';
        taskDateInput.value = '';
        checkAddTaskInputs();
    });
    
    
    /* ===== TASK CHECKBOX TOGGLE ===== */
    
    function attachTaskEventListeners(taskItem) {
        const checkbox = taskItem.querySelector('.task-checkbox');
        const deleteBtn = taskItem.querySelector('.task-delete-btn');
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                taskItem.classList.add('task-item--completed');
                showNotification('🎉', 'Task completed! Great job!');
            } else {
                taskItem.classList.remove('task-item--completed');
                showNotification('⚠️', 'Task marked as incomplete');
            }
            
            updateStats();
        });
        
        deleteBtn.addEventListener('click', function() {
            taskItem.style.transition = 'all 0.3s ease';
            taskItem.style.opacity = '0';
            taskItem.style.transform = 'translateX(-30px)';
            
            setTimeout(() => {
                taskItem.remove();
                updateStats();
                showNotification('🗑️', 'Task deleted');
            }, 300);
        });
    }
    
    
    /* ===== ATTACH EVENT LISTENERS TO EXISTING TASKS ===== */
    
    const existingTasks = document.querySelectorAll('.task-item');
    existingTasks.forEach(task => {
        attachTaskEventListeners(task);
    });
    
    
    /* ===== INITIAL ANIMATION ===== */
    
    existingTasks.forEach((task, index) => {
        task.style.opacity = '0';
        task.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            task.style.transition = 'all 0.5s ease';
            task.style.opacity = '1';
            task.style.transform = 'translateX(0)';
        }, index * 100);
    });
    
    
    /* ===== INITIALIZE STATS ===== */
    
    updateStats();
    
    
    /* ===== LOG LOADED MESSAGE ===== */
    
    console.log('✨ StudyMate Tasks & Goals loaded successfully!');
    console.log('📝 To-Do List ready!');
    console.log('📊 Progress tracking ready!');
});