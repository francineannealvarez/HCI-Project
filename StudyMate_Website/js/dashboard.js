/* ========================================
   DASHBOARD JAVASCRIPT - Interactive Features
   ======================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    /* ===== CHART TOGGLE FUNCTIONALITY ===== */
    const toggleChartBtn = document.getElementById('toggleChart');
    const chartContainer = document.getElementById('chartContainer');
    const chevron = toggleChartBtn.querySelector('.chevron');
    
    if (toggleChartBtn && chartContainer) {
        toggleChartBtn.addEventListener('click', function() {
            chartContainer.classList.toggle('hidden');
            chevron.classList.toggle('rotated');
            
            // Update button text
            const spans = toggleChartBtn.querySelectorAll('span');
            const textSpan = spans[spans.length - 1];
            if (chartContainer.classList.contains('hidden')) {
                textSpan.textContent = 'Show';
            } else {
                textSpan.textContent = 'Hide';
            }
        });
    }
    
    
    /* ===== BAR CHART DYNAMIC HEIGHTS & TOOLTIPS ===== */
    const barChart = document.getElementById('barChart');
    const barItems = document.querySelectorAll('.bar-item');
    
    if (barChart && barItems.length > 0) {
        const MAX_HOURS = 10; // Y-axis goes from 0-10
        
        barItems.forEach(barItem => {
            const bar = barItem.querySelector('.bar');
            
            // Get subjects data from data attribute
            const subjectsData = JSON.parse(barItem.getAttribute('data-subjects') || '[]');
            
            // Calculate total hours for this day
            let totalHours = 0;
            subjectsData.forEach(subject => {
                totalHours += subject.hours;
            });
            
            // Calculate height as percentage of MAX_HOURS (0-10 scale)
            const heightPercentage = (totalHours / MAX_HOURS) * 100;
            
            // Set the bar height dynamically
            bar.style.height = heightPercentage + '%';
            
            // Create tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'bar-tooltip';
            bar.appendChild(tooltip); 
            
            // Build tooltip content
            let tooltipContent = '';
            
            subjectsData.forEach((subject, index) => {
                tooltipContent += `
                    <div class="bar-tooltip-subject">${subject.name}</div>
                    <div class="bar-tooltip-hours">${subject.hours} hour${subject.hours !== 1 ? 's' : ''}</div>
                `;
                
                // Add divider between subjects if there are multiple
                if (index < subjectsData.length - 1) {
                    tooltipContent += '<hr class="bar-tooltip-divider">';
                }
            });
            
            // Add total if multiple subjects
            if (subjectsData.length > 1) {
                tooltipContent += `<hr class="bar-tooltip-divider">`;
                tooltipContent += `<div class="bar-tooltip-hours"><strong>Total: ${totalHours} hours</strong></div>`;
            }
            
            tooltip.innerHTML = tooltipContent;
            
            // Show tooltip on hover
            bar.addEventListener('mouseenter', function() {
                tooltip.classList.add('show');
                barItem.classList.add('active');
                barChart.classList.add('hovering');
            });
            
            bar.addEventListener('mouseleave', function() {
                tooltip.classList.remove('show');
                barItem.classList.remove('active');
                barChart.classList.remove('hovering');
            });
        });
        
        
        /* ===== CALCULATE SUMMARY STATS ===== */
        const summaryStatsContainer = document.querySelector('.chart-summary-stats');
        
        if (summaryStatsContainer) {
            let totalHours = 0;
            let maxHours = 0;
            let maxDay = '';
            
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            
            barItems.forEach((barItem, index) => {
                const subjectsData = JSON.parse(barItem.getAttribute('data-subjects') || '[]');
                let dayTotal = 0;
                
                subjectsData.forEach(subject => {
                    dayTotal += subject.hours;
                });
                
                totalHours += dayTotal;
                
                if (dayTotal > maxHours) {
                    maxHours = dayTotal;
                    maxDay = days[index];
                }
            });
            
            const averageHours = (totalHours / 7).toFixed(1);
            
            // Update the summary stats in the DOM
            const totalElement = document.querySelector('.summary-stat-value.total');
            const productiveElement = document.querySelector('.summary-stat-value.productive');
            const averageElement = document.querySelector('.summary-stat-value.average');
            
            if (totalElement) totalElement.textContent = totalHours + ' hrs';
            if (productiveElement) productiveElement.textContent = maxDay;
            if (averageElement) averageElement.textContent = averageHours + ' hrs';
        }
    }
    
    
    /* ===== SMOOTH SCROLL FOR NAV ITEMS ===== */
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
    
    
    /* ===== ACTIVITY ITEM ANIMATIONS ===== */
    const activityItems = document.querySelectorAll('.activity-item');
    
    // Add entrance animation with stagger effect
    activityItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
    
    
    /* ===== STAT CARDS ANIMATION ===== */
    const statCards = document.querySelectorAll('.stat-card');
    
    // Add entrance animation
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100 + 200);
    });
    
    
    /* ===== ANIMATED COUNTER FOR STATS ===== */
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Parse the value to handle both numbers and text with units
            const currentValue = Math.floor(progress * (end - start) + start);
            
            // Check if the original text contains "hrs", "days", or "%"
            const originalText = element.textContent;
            if (originalText.includes('hrs')) {
                element.textContent = currentValue + '.0 hrs';
            } else if (originalText.includes('days')) {
                element.textContent = currentValue + ' days';
            } else if (originalText.includes('%')) {
                element.textContent = currentValue + '%';
            } else {
                element.textContent = currentValue;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Animate stat values on page load
    setTimeout(() => {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(statValue => {
            const text = statValue.textContent;
            const numericValue = parseFloat(text);
            
            if (!isNaN(numericValue)) {
                animateValue(statValue, 0, numericValue, 1500);
            }
        });
    }, 500);
    
    
    /* ===== QUOTE CARD INTERACTION ===== */
    const quoteCard = document.querySelector('.quote-card');
    
    if (quoteCard) {
        // Add click ripple effect
        quoteCard.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.left = e.clientX - this.offsetLeft - 10 + 'px';
            ripple.style.top = e.clientY - this.offsetTop - 10 + 'px';
            ripple.style.animation = 'ripple 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }
    
    // Add ripple animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    
    /* ===== RESPONSIVE NAV MENU ACTIVE STATE ===== */
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('nav-item--active');
        }
    });
    
    
    /* ===== LOG LOADED MESSAGE ===== */
    console.log('✨ StudyMate Dashboard loaded successfully!');
    console.log('📊 All interactive features are active.');
    console.log('📈 Dynamic bar heights calculated from data.');
});


/* ===== UTILITY FUNCTIONS ===== */

// Function to format time
function formatTime(hours) {
    if (hours < 1) {
        return Math.round(hours * 60) + ' minutes';
    } else if (hours === 1) {
        return '1 hour';
    } else {
        return hours.toFixed(1) + ' hours';
    }
}

// Function to get greeting based on time
function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

// Update user greeting if needed (optional enhancement)
const userGreeting = document.querySelector('.user-status');
if (userGreeting && userGreeting.textContent === 'Ready to study?') {
}