// Calendar functionality
class DrTimeCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.selectedTimeSlot = null;
        this.availableSlots = {
            // Sample available time slots for each day
            // In a real app, this would come from a backend API
        };
        
        this.init();
    }
    
    init() {
        this.renderCalendar();
        this.bindEvents();
        this.generateSampleAvailability();
    }
    
    generateSampleAvailability() {
        // Generate sample availability for the next 30 days
        const today = new Date();
        for (let i = 1; i <= 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            // Skip weekends for this demo
            if (date.getDay() === 0 || date.getDay() === 6) continue;
            
            const dateStr = this.formatDate(date);
            this.availableSlots[dateStr] = this.generateTimeSlots();
        }
    }
    
    generateTimeSlots() {
        const slots = [];
        const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        
        times.forEach(time => {
            // Randomly make some slots unavailable for demo
            const isAvailable = Math.random() > 0.3;
            if (isAvailable) {
                slots.push(time);
            }
        });
        
        return slots;
    }
    
    renderCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        const monthElement = document.getElementById('currentMonth');
        
        // Clear existing calendar days
        const existingDays = calendarGrid.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());
        
        // Update month display
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        monthElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        
        // Get first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // Generate calendar days
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = date.getDate();
            
            // Add classes based on date status
            if (date.getMonth() !== this.currentDate.getMonth()) {
                dayElement.classList.add('other-month');
            } else if (date < new Date().setHours(0, 0, 0, 0)) {
                dayElement.classList.add('unavailable');
            } else if (this.availableSlots[this.formatDate(date)]) {
                dayElement.classList.add('available');
            } else {
                dayElement.classList.add('unavailable');
            }
            
            // Add click event for available days
            if (dayElement.classList.contains('available')) {
                dayElement.addEventListener('click', () => this.selectDate(date));
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    selectDate(date) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Add selection to clicked day
        event.target.classList.add('selected');
        
        this.selectedDate = date;
        document.getElementById('selectedDate').value = this.formatDateDisplay(date);
        
        // Update available time slots
        this.updateTimeSlots(date);
    }
    
    updateTimeSlots(date) {
        const timeSlotsContainer = document.getElementById('timeSlots');
        const dateStr = this.formatDate(date);
        const availableSlots = this.availableSlots[dateStr] || [];
        
        if (availableSlots.length === 0) {
            timeSlotsContainer.innerHTML = '<p class="no-date">No available times for this date</p>';
            return;
        }
        
        timeSlotsContainer.innerHTML = '';
        
        availableSlots.forEach(time => {
            const slotButton = document.createElement('button');
            slotButton.type = 'button';
            slotButton.className = 'time-slot-btn';
            slotButton.textContent = time;
            
            slotButton.addEventListener('click', () => this.selectTimeSlot(time, slotButton));
            
            timeSlotsContainer.appendChild(slotButton);
        });
    }
    
    selectTimeSlot(time, buttonElement) {
        // Remove previous selection
        document.querySelectorAll('.time-slot-btn.selected').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked button
        buttonElement.classList.add('selected');
        this.selectedTimeSlot = time;
    }
    
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    
    formatDateDisplay(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    bindEvents() {
        // Month navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        
        // Form submission
        document.getElementById('appointmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }
    
    handleFormSubmission() {
        const formData = {
            service: document.getElementById('service').value,
            date: this.selectedDate,
            time: this.selectedTimeSlot,
            name: document.getElementById('clientName').value,
            email: document.getElementById('clientEmail').value,
            phone: document.getElementById('clientPhone').value,
            notes: document.getElementById('notes').value
        };
        
        // Validate required fields
        if (!formData.service || !formData.date || !formData.time || !formData.name || !formData.email || !formData.phone) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate API call
        this.bookAppointment(formData);
    }
    
    bookAppointment(formData) {
        // Show loading state
        const submitButton = document.querySelector('#appointmentForm button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        submitButton.disabled = true;
        
        // Simulate API delay
        setTimeout(() => {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Show success modal
            this.showSuccessModal(formData);
            
            // Reset form
            document.getElementById('appointmentForm').reset();
            this.selectedDate = null;
            this.selectedTimeSlot = null;
            document.getElementById('timeSlots').innerHTML = '<p class="no-date">Please select a date first</p>';
            
            // Remove calendar selection
            document.querySelectorAll('.calendar-day.selected').forEach(day => {
                day.classList.remove('selected');
            });
            
        }, 2000);
    }
    
    showSuccessModal(formData) {
        const modal = document.getElementById('successModal');
        const summaryElement = document.getElementById('appointmentSummary');
        
        const serviceNames = {
            'business': 'Business Consultation',
            'financial': 'Financial Advisory',
            'technology': 'Technology Consulting',
            'career': 'Career Coaching'
        };
        
        summaryElement.innerHTML = `
            <h4>Appointment Details</h4>
            <p><strong>Service:</strong> ${serviceNames[formData.service]}</p>
            <p><strong>Date:</strong> ${this.formatDateDisplay(formData.date)}</p>
            <p><strong>Time:</strong> ${formData.time}</p>
            <p><strong>Client:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
            ${formData.notes ? `<p><strong>Notes:</strong> ${formData.notes}</p>` : ''}
        `;
        
        modal.classList.add('show');
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : '#10b981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 1001;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add notification styles if not exists
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                .notification-close:hover {
                    opacity: 0.8;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Utility functions
function closeModal() {
    document.getElementById('successModal').classList.remove('show');
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });
        
        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
            });
        });
    }
}

// Header scroll effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--bg-primary)';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .contact-item, .emergency-card').forEach(el => {
        observer.observe(el);
    });
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Google Calendar functionality
function initGoogleCalendar() {
    const googleCalendarBtn = document.getElementById('googleCalendarBtn');
    
    if (googleCalendarBtn) {
        // Add click tracking for analytics (optional)
        googleCalendarBtn.addEventListener('click', function() {
            console.log('Google Calendar booking link clicked');
            // You can add analytics tracking here if needed
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendar
    new DrTimeCalendar();
    
    // Initialize other features
    initSmoothScrolling();
    initMobileMenu();
    initHeaderScrollEffect();
    initScrollAnimations();
    initGoogleCalendar();
    
    // Close modal when clicking outside
    document.getElementById('successModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    console.log('Consultant Set Time Calendar initialized successfully!');
});

// Service worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}