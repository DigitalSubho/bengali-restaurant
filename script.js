/**
 * Bhoj Kuthir (ভোজকুঠির) - Interactive Frontend Engine
 * Includes: Single Page Application Routing, Dynamic Menu Filtering, Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMenuFilter();
    initReservationForm();
    setMinBookingDate();
});

/* ================= 1. Single-Page Navigation & Routing ================= */
function initNavigation() {
    const navLinks = document.querySelectorAll('[data-page]');
    const pages = document.querySelectorAll('.page-view');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    function switchPage(pageId) {
        // Toggle view visibility
        pages.forEach(page => {
            if (page.id === `page-${pageId}`) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        // Update active class on top navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Close mobile dropdown if open
        if (navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
        }

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Attach click listeners to all routing triggers
    navLinks.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = trigger.getAttribute('data-page');
            if (targetPage) {
                window.location.hash = targetPage;
                switchPage(targetPage);
            }
        });
    });

    // Handle mobile hamburger toggle
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    // Handle browser back/forward and initial URL hashes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '') || 'home';
        switchPage(hash);
    });

    // Default load according to hash or fallback to 'home'
    const initialHash = window.location.hash.replace('#', '') || 'home';
    switchPage(initialHash);
}

/* ================= 2. Menu Category Filtering ================= */
function initMenuFilter() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active tab button style
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-category');

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ================= 3. Date Picker Constraints ================= */
function setMinBookingDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        // Prevent booking dates in the past
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

/* ================= 4. Reservation Form Validation & Processing ================= */
function initReservationForm() {
    const form = document.getElementById('booking-form');
    const banner = document.getElementById('confirmation-banner');
    const summaryText = document.getElementById('booking-summary-text');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Clear all previous errors
        form.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

        // Form Fields
        const name = document.getElementById('fullName');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const guests = document.getElementById('guests');
        const date = document.getElementById('date');
        const time = document.getElementById('time');

        // Validation: Full Name
        if (!name.value.trim()) {
            showError(name, 'অনুগ্রহ করে আপনার পুরো নাম লিখুন (Please enter your name)');
            isValid = false;
        }

        // Validation: Phone (Indian standard 10-digit check)
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = phone.value.replace(/[\s+-]/g, '').slice(-10);
        if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
            showError(phone, 'অনুগ্রহ করে ১০ সংখ্যার সঠিক ফোন নম্বর দিন (Valid 10-digit number)');
            isValid = false;
        }

        // Validation: Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            showError(email, 'সঠিক ইমেল ঠিকানা লিখুন (Valid email required)');
            isValid = false;
        }

        // Validation: Guests
        if (!guests.value) {
            showError(guests, 'অতিথি সংখ্যা নির্বাচন করুন (Select guests)');
            isValid = false;
        }

        // Validation: Date
        if (!date.value) {
            showError(date, 'তারিখ নির্বাচন করুন (Select booking date)');
            isValid = false;
        }

        // Validation: Time Slot
        if (!time.value) {
            showError(time, 'ভোজনের সময় নির্বাচন করুন (Select dining slot)');
            isValid = false;
        }

        if (isValid) {
            // Display confirmation summary
            const selectedTimeText = time.options[time.selectedIndex].text;
            summaryText.innerHTML = `
                ধন্যবাদ <strong>${escapeHTML(name.value)}</strong> মহাশয়/মহাশয়া!<br>
                আপনার <strong>${escapeHTML(guests.value)}</strong> জনের আসন <strong>${escapeHTML(date.value)}</strong> তারিখে (<strong>${selectedTimeText}</strong>) সংরক্ষণ করা হয়েছে।<br>
                নিশ্চিতকরণ এসএমএস আপনার নম্বরে (${escapeHTML(phone.value)}) পাঠানো হয়েছে।
            `;
            
            banner.classList.remove('hidden');
            form.reset();

            // Scroll to the confirmation message
            banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    function showError(inputElement, message) {
        const errorContainer = inputElement.parentElement.querySelector('.error-msg');
        if (errorContainer) {
            errorContainer.textContent = message;
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
}