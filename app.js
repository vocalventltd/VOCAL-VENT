// Main application functionality for Vocal Vent

// Application state
const AppState = {
    currentUser: null,
    currentBooking: null,
    currentChat: null,
    settings: {},
    notifications: []
};

// Initialize application
function initApp() {
    console.log('Vocal Vent App Initialized');
    
    // Load saved state
    loadAppState();
    
    // Check disclaimer agreement
    checkDisclaimer();
    
    // Load settings
    loadSettings();
    
    // Setup event listeners
    setupGlobalListeners();
    
    // Initialize Firebase (if needed)
    initFirebase();
}

// Load application state from localStorage
function loadAppState() {
    try {
        const savedState = localStorage.getItem('vocalVentState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            Object.assign(AppState, parsedState);
        }
        
        // Load notifications
        const savedNotifications = localStorage.getItem('vocalVentNotifications');
        if (savedNotifications) {
            AppState.notifications = JSON.parse(savedNotifications);
        }
    } catch (error) {
        console.error('Error loading app state:', error);
    }
}

// Save application state to localStorage
function saveAppState() {
    try {
        const stateToSave = {
            currentUser: AppState.currentUser,
            currentBooking: AppState.currentBooking,
            currentChat: AppState.currentChat,
            settings: AppState.settings
        };
        localStorage.setItem('vocalVentState', JSON.stringify(stateToSave));
    } catch (error) {
        console.error('Error saving app state:', error);
    }
}

// Check if user has agreed to disclaimer
function checkDisclaimer() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Pages that don't require disclaimer
    const publicPages = ['index.html', 'disclaimer.html'];
    
    if (!publicPages.includes(currentPage)) {
        const agreement = localStorage.getItem('vocalVentAgreement');
        if (!agreement) {
            window.location.href = 'disclaimer.html';
        }
    }
}

// Load application settings
function loadSettings() {
    try {
        // Load contact settings
        const contactSettings = localStorage.getItem('contactSettings');
        if (contactSettings) {
            AppState.settings.contacts = JSON.parse(contactSettings);
        } else {
            // Default contact settings
            AppState.settings.contacts = {
                contactLine1: '+254 700 000 001',
                contactLine2: '+254 700 000 002',
                whatsappNumber: '+254 700 000 003',
                instagramHandle: '@vocalvent',
                email: 'support@vocalvent.com'
            };
        }
        
        // Load package pricing
        const packagePricing = localStorage.getItem('packagePricing');
        if (packagePricing) {
            AppState.settings.pricing = JSON.parse(packagePricing);
        } else {
            // Default pricing
            AppState.settings.pricing = {
                mini: '200',
                lite: '400',
                vip: '1000',
                express: '500',
                chat30: '300',
                chat60: '500'
            };
        }
        
        // Load chat settings
        const chatSettings = localStorage.getItem('chatSettings');
        if (chatSettings) {
            AppState.settings.chat = JSON.parse(chatSettings);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Setup global event listeners
function setupGlobalListeners() {
    // Handle back button
    window.addEventListener('popstate', function(event) {
        handleNavigation();
    });
    
    // Handle online/offline status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Auto-save app state when leaving page
    window.addEventListener('beforeunload', saveAppState);
    
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', function() {
            console.log('New service worker activated');
            showNotification('App has been updated. Please refresh for the latest version.');
        });
    }
}

// Initialize Firebase (optional)
function initFirebase() {
    // Check if Firebase is needed on current page
    const pagesNeedingFirebase = ['admin.html', 'chat-session.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (pagesNeedingFirebase.includes(currentPage)) {
        // Firebase would be initialized here
        console.log('Firebase initialization required for this page');
    }
}

// Navigation handler
function handleNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Navigated to:', currentPage);
    
    // Update active navigation
    updateActiveNav(currentPage);
    
    // Load page-specific functionality
    loadPageFunctionality(currentPage);
}

// Update active navigation
function updateActiveNav(currentPage) {
    // Remove active class from all nav items
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page
    const currentLink = document.querySelector(`nav a[href="${currentPage}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

// Load page-specific functionality
function loadPageFunctionality(page) {
    switch(page) {
        case 'index.html':
            initHomePage();
            break;
        case 'booking.html':
            initBookingPage();
            break;
        case 'messaging.html':
            initMessagingPage();
            break;
        case 'corporate.html':
            initCorporatePage();
            break;
        case 'admin.html':
            initAdminPage();
            break;
        default:
            // Generic initialization
            initGenericPage();
    }
}

// Home page initialization
function initHomePage() {
    console.log('Initializing home page');
    
    // Load statistics
    loadHomeStatistics();
    
    // Setup call-to-action buttons
    setupCTAButtons();
    
    // Initialize testimonials slider
    initTestimonials();
}

// Booking page initialization
function initBookingPage() {
    console.log('Initializing booking page');
    
    // Load available packages
    loadPackages();
    
    // Setup package selection
    setupPackageSelection();
    
    // Initialize date/time pickers
    initDateTimePickers();
}

// Messaging page initialization
function initMessagingPage() {
    console.log('Initializing messaging page');
    
    // Load chat platforms
    loadChatPlatforms();
    
    // Setup chat platform selection
    setupChatSelection();
    
    // Initialize chat interface
    initChatInterface();
}

// Corporate page initialization
function initCorporatePage() {
    console.log('Initializing corporate page');
    
    // Load corporate information
    loadCorporateInfo();
    
    // Setup multi-step form
    setupCorporateForm();
    
    // Initialize form validation
    initFormValidation();
}

// Admin page initialization
function initAdminPage() {
    console.log('Initializing admin page');
    
    // Check admin authentication
    checkAdminAuth();
    
    // Load admin dashboard
    loadAdminDashboard();
    
    // Setup admin functionality
    setupAdminFunctionality();
}

// Generic page initialization
function initGenericPage() {
    console.log('Initializing generic page');
    
    // Common functionality for all pages
    setupCommonUI();
    loadPageContent();
}

// Load home page statistics
function loadHomeStatistics() {
    try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const chatSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
        const corporateRequests = JSON.parse(localStorage.getItem('corporateRequests') || '[]');
        
        // Update statistics display if elements exist
        const statsElement = document.getElementById('homeStatistics');
        if (statsElement) {
            statsElement.innerHTML = `
                <div class="grid grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="text-3xl font-bold">${bookings.length}</div>
                        <div class="text-gray-600">Calls Booked</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold">${chatSessions.length}</div>
                        <div class="text-gray-600">Chat Sessions</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold">${corporateRequests.length}</div>
                        <div class="text-gray-600">Corporate Clients</div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Setup call-to-action buttons
function setupCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            handleCTAAction(action);
        });
    });
}

// Handle CTA actions
function handleCTAAction(action) {
    switch(action) {
        case 'book-call':
            window.location.href = 'disclaimer.html';
            break;
        case 'start-chat':
            window.location.href = 'disclaimer.html';
            break;
        case 'corporate':
            window.location.href = 'corporate.html';
            break;
        default:
            console.log('Unknown CTA action:', action);
    }
}

// Initialize testimonials slider
function initTestimonials() {
    const testimonials = [
        {
            text: "Vocal Vent gave me a safe space to express myself without judgment. The anonymity made me feel comfortable sharing things I couldn't tell anyone else.",
            author: "Anonymous User"
        },
        {
            text: "The 10-minute MINI space was perfect for my busy schedule. I felt heard and understood. Definitely booking again!",
            author: "Regular User"
        },
        {
            text: "Our company signed up for the corporate package, and employee feedback has been overwhelmingly positive. It's made a real difference in workplace well-being.",
            author: "HR Manager"
        }
    ];
    
    const testimonialsElement = document.getElementById('testimonials');
    if (testimonialsElement) {
        testimonialsElement.innerHTML = testimonials.map(testimonial => `
            <div class="bg-white p-6 rounded-xl shadow-lg">
                <div class="text-yellow-400 mb-4">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <p class="text-gray-600 italic mb-4">"${testimonial.text}"</p>
                <p class="font-bold text-gray-800">- ${testimonial.author}</p>
            </div>
        `).join('');
    }
}

// Load packages for booking page
function loadPackages() {
    const packages = [
        {
            id: 'mini',
            name: 'MINI Space',
            duration: '10 Minutes',
            price: AppState.settings.pricing?.mini || '200',
            description: 'The Vocal Vent MINI Space offers you a 10 Minute Space to vent and release whatever is holding you back, Speaking it out is always a step in letting it go.',
            features: ['10 minutes', 'Anonymous', 'Trained listener', 'Safe space']
        },
        {
            id: 'lite',
            name: 'LITE Space',
            duration: '20 Minutes',
            price: AppState.settings.pricing?.lite || '400',
            description: 'The Vocal Vent LITE Space offers you a 20 Minute Space to vent and release whatever is holding you back, Speaking it out is always a step in letting it go.',
            features: ['20 minutes', 'Anonymous', 'Trained listener', 'Safe space', 'Extended time']
        },
        {
            id: 'vip',
            name: 'V.I.P Space',
            duration: '2 Hours',
            price: AppState.settings.pricing?.vip || '1000',
            description: 'The Vocal Vent V.I.P Space offers you a 2 Hour Space to vent and release whatever is holding you back, Speaking it out is always a step in letting it go.',
            features: ['2 hours', 'Anonymous', 'Priority listener', 'Safe space', 'Extended support']
        },
        {
            id: 'express',
            name: 'EXPRESS LINE Space',
            duration: '30 Minutes',
            price: AppState.settings.pricing?.express || '500',
            description: 'The Vocal Vent Express Line Space allows instant calls without scheduling. This Space offers you a 30 Minute Space to vent and release whatever is holding you back.',
            features: ['30 minutes', 'Instant calls', 'Anonymous', 'Trained listener', 'No scheduling']
        }
    ];
    
    const packagesElement = document.getElementById('packagesContainer');
    if (packagesElement) {
        packagesElement.innerHTML = packages.map(pkg => `
            <div class="package-card bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="package-header p-6 text-center">
                    <h3 class="text-xl font-bold mb-2">${pkg.name}</h3>
                    <p class="text-sm opacity-90">${pkg.duration} Venting Space</p>
                </div>
                <div class="p-6">
                    <div class="text-center mb-6">
                        <div class="h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                            <i class="fas fa-clock text-4xl text-purple-500"></i>
                        </div>
                        <p class="text-gray-600 mb-4">${pkg.description}</p>
                        <div class="text-3xl font-bold text-gray-800 mb-2">KSH ${pkg.price}</div>
                        <div class="space-y-2">
                            ${pkg.features.map(feature => `
                                <div class="flex items-center text-sm text-gray-600">
                                    <i class="fas fa-check text-green-500 mr-2"></i>
                                    <span>${feature}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <button class="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition duration-300 select-package" data-package="${pkg.id}" data-price="${pkg.price}">
                        Select ${pkg.name.split(' ')[0]} Space
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Setup package selection
function setupPackageSelection() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-package')) {
            const packageId = e.target.dataset.package;
            const price = e.target.dataset.price;
            
            // Store selected package
            AppState.currentBooking = {
                packageId: packageId,
                price: price,
                selectedAt: new Date().toISOString()
            };
            
            // Save state
            saveAppState();
            
            // Show next step
            showBookingStep(2);
        }
    });
}

// Initialize date/time pickers
function initDateTimePickers() {
    // Set minimum date to tomorrow
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        
        // Set maximum date to 30 days from now
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
    
    // Set time constraints (9 AM to 8 PM)
    const timeInput = document.getElementById('bookingTime');
    if (timeInput) {
        timeInput.min = "09:00";
        timeInput.max = "20:00";
    }
}

// Load chat platforms
function loadChatPlatforms() {
    const platforms = [
        {
            id: 'whatsapp',
            name: 'WhatsApp Chat',
            icon: 'fab fa-whatsapp',
            color: 'text-green-500',
            bgColor: 'bg-green-100',
            description: 'Chat with our trained listeners via WhatsApp',
            popular: true
        },
        {
            id: 'inapp',
            name: 'In-App Chat',
            icon: 'fas fa-comment-dots',
            color: 'text-purple-500',
            bgColor: 'bg-purple-100',
            description: 'Chat directly within the Vocal Vent app',
            new: true
        },
        {
            id: 'sms',
            name: 'SMS Chat',
            icon: 'fas fa-sms',
            color: 'text-blue-500',
            bgColor: 'bg-blue-100',
            description: 'Vent via text message (SMS)',
            feature: 'No Internet Required'
        },
        {
            id: 'instagram',
            name: 'Instagram DM',
            icon: 'fab fa-instagram',
            color: 'text-pink-500',
            bgColor: 'bg-pink-100',
            description: 'Message us through Instagram Direct Messages',
            feature: 'Social Media'
        }
    ];
    
    const platformsElement = document.getElementById('chatPlatforms');
    if (platformsElement) {
        platformsElement.innerHTML = platforms.map(platform => `
            <div class="chat-platform bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition duration-300 border-2 border-transparent" data-platform="${platform.id}">
                <div class="text-center">
                    <div class="${platform.color} text-5xl mb-4">
                        <i class="${platform.icon}"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">${platform.name}</h3>
                    <p class="text-gray-600 mb-4">${platform.description}</p>
                    <div class="inline-flex items-center ${platform.bgColor} ${platform.color.replace('text', 'text')} px-3 py-1 rounded-full text-sm">
                        ${platform.popular ? '<i class="fas fa-users mr-1"></i><span>Most Popular</span>' :
                          platform.new ? '<i class="fas fa-star mr-1"></i><span>New Feature</span>' :
                          `<i class="fas fa-${platform.id === 'sms' ? 'mobile-alt' : 'hashtag'} mr-1"></i><span>${platform.feature}</span>`}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Setup chat selection
function setupChatSelection() {
    document.addEventListener('click', function(e) {
        const platformCard = e.target.closest('.chat-platform');
        if (platformCard) {
            const platformId = platformCard.dataset.platform;
            
            // Store selected platform
            AppState.currentChat = {
                platform: platformId,
                selectedAt: new Date().toISOString()
            };
            
            // Save state
            saveAppState();
            
            // Show duration selection
            showChatStep(2);
        }
    });
}

// Initialize chat interface
function initChatInterface() {
    // This would initialize the chat interface
    // including WebSocket connections, message handling, etc.
    console.log('Chat interface initialized');
}

// Load corporate information
function loadCorporateInfo() {
    // Load corporate package details
    const corporateInfo = {
        title: 'Vocal Vent Corporate',
        description: 'Employee Well-being Through Anonymous Venting',
        features: [
            '10 Minute Space 4 Times a Month',
            'Complete anonymity for employees',
            'Dedicated corporate dashboard',
            'Usage analytics and reports',
            'Employee well-being metrics',
            'Custom subscription packages'
        ],
        benefits: [
            'Improved employee morale',
            'Reduced workplace stress',
            'Early identification of issues',
            'Enhanced company culture',
            'Increased productivity'
        ]
    };
    
    // Update corporate page with this info
    const infoElement = document.getElementById('corporateInfo');
    if (infoElement) {
        infoElement.innerHTML = `
            <div class="bg-white rounded-xl shadow-lg p-8">
                <h2 class="text-2xl font-bold mb-6">${corporateInfo.title}</h2>
                <p class="text-gray-600 mb-6">${corporateInfo.description}</p>
                
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-lg font-bold mb-4">Features</h3>
                        <ul class="space-y-3">
                            ${corporateInfo.features.map(feature => `
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                                    <span>${feature}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold mb-4">Benefits</h3>
                        <ul class="space-y-3">
                            ${corporateInfo.benefits.map(benefit => `
                                <li class="flex items-start">
                                    <i class="fas fa-star text-yellow-500 mt-1 mr-3"></i>
                                    <span>${benefit}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
}

// Setup corporate multi-step form
function setupCorporateForm() {
    const steps = ['introduction', 'details', 'contact', 'review'];
    let currentStep = 0;
    
    function showStep(stepIndex) {
        // Hide all steps
        steps.forEach((step, index) => {
            const stepElement = document.getElementById(`step-${step}`);
            if (stepElement) {
                stepElement.classList.toggle('hidden', index !== stepIndex);
            }
        });
        
        // Update step indicators
        updateStepIndicators(stepIndex);
        
        currentStep = stepIndex;
    }
    
    function updateStepIndicators(activeIndex) {
        steps.forEach((step, index) => {
            const indicator = document.querySelector(`.step-indicator[data-step="${step}"]`);
            if (indicator) {
                indicator.classList.remove('active', 'completed');
                if (index < activeIndex) {
                    indicator.classList.add('completed');
                } else if (index === activeIndex) {
                    indicator.classList.add('active');
                }
            }
        });
    }
    
    // Initialize step navigation
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = currentStep + 1;
            if (nextStep < steps.length) {
                showStep(nextStep);
            }
        });
    });
    
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = currentStep - 1;
            if (prevStep >= 0) {
                showStep(prevStep);
            }
        });
    });
    
    // Initialize first step
    showStep(0);
}

// Initialize form validation
function initFormValidation() {
    // Add validation to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

// Validate form
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[+]?[\d\s\-()]+$/;
            if (!phoneRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'text-red-500 text-sm mt-1';
    errorElement.textContent = message;
    
    field.classList.add('border-red-500');
    field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('border-red-500');
    
    const existingError = field.parentNode.querySelector('.text-red-500');
    if (existingError) {
        existingError.remove();
    }
}

// Check admin authentication
function checkAdminAuth() {
    const isAdmin = localStorage.getItem('adminLoggedIn');
    if (!isAdmin && window.location.pathname.includes('admin.html')) {
        // Redirect to login or show login modal
        window.location.href = 'index.html';
    }
}

// Load admin dashboard
function loadAdminDashboard() {
    // Load admin data
    loadAdminData();
    
    // Setup admin charts
    setupAdminCharts();
    
    // Initialize admin functionality
    initAdminFunctionality();
}

// Setup admin functionality
function setupAdminFunctionality() {
    // This would setup all admin-specific functionality
    console.log('Admin functionality setup');
}

// Setup common UI elements
function setupCommonUI() {
    // Initialize tooltips
    initTooltips();
    
    // Initialize modals
    initModals();
    
    // Initialize notifications
    initNotifications();
    
    // Setup dark mode toggle
    setupDarkMode();
}

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.dataset.tooltip;
            showTooltip(e, tooltipText);
        });
        
        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Show tooltip
function showTooltip(event, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg';
    tooltip.textContent = text;
    tooltip.id = 'current-tooltip';
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const x = event.clientX + 10;
    const y = event.clientY + 10;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('current-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Initialize modals
function initModals() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.add('hidden');
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal-overlay:not(.hidden)');
            if (openModal) {
                openModal.classList.add('hidden');
            }
        }
    });
}

// Initialize notifications
function initNotifications() {
    // Check for new notifications
    checkForNotifications();
    
    // Setup notification bell
    const notificationBell = document.getElementById('notificationBell');
    if (notificationBell) {
        notificationBell.addEventListener('click', showNotifications);
    }
}

// Check for notifications
function checkForNotifications() {
    // This would check for new notifications from server
    // For now, we'll use localStorage
    const unreadNotifications = AppState.notifications.filter(n => !n.read);
    
    // Update notification badge
    const badge = document.querySelector('.notification-badge');
    if (badge && unreadNotifications.length > 0) {
        badge.textContent = unreadNotifications.length;
        badge.classList.remove('hidden');
    }
}

// Show notifications
function showNotifications() {
    // Create notifications dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50';
    dropdown.innerHTML = `
        <div class="p-4">
            <h3 class="font-bold mb-3">Notifications</h3>
            ${AppState.notifications.map(notification => `
                <div class="p-3 border-b hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}">
                    <div class="font-medium">${notification.title}</div>
                    <div class="text-sm text-gray-600">${notification.message}</div>
                    <div class="text-xs text-gray-400 mt-1">${formatTime(notification.timestamp)}</div>
                </div>
            `).join('')}
            ${AppState.notifications.length === 0 ? '<div class="text-center text-gray-500 py-4">No notifications</div>' : ''}
        </div>
    `;
    
    document.body.appendChild(dropdown);
    
    // Remove dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && e.target !== notificationBell) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    });
}

// Setup dark mode
function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        // Check saved preference
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            darkModeToggle.checked = true;
        }
        
        // Toggle dark mode
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }
}

// Load page content
function loadPageContent() {
    // This would dynamically load content based on the page
    console.log('Loading page content');
}

// Show booking step
function showBookingStep(step) {
    const steps = document.querySelectorAll('.booking-step');
    steps.forEach((stepElement, index) => {
        stepElement.classList.toggle('hidden', index + 1 !== step);
    });
    
    // Update progress bar
    updateProgressBar(step, 3);
}

// Show chat step
function showChatStep(step) {
    const steps = document.querySelectorAll('.chat-step');
    steps.forEach((stepElement, index) => {
        stepElement.classList.toggle('hidden', index + 1 !== step);
    });
    
    // Update progress bar
    updateProgressBar(step, 3);
}

// Update progress bar
function updateProgressBar(currentStep, totalSteps) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const percentage = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

// Format time
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // Less than 1 minute
        return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) { // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in 
        ${type === 'success' ? 'bg-green-500 text-white' :
         type === 'error' ? 'bg-red-500 text-white' :
         type === 'warning' ? 'bg-yellow-500 text-white' :
         'bg-blue-500 text-white'}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Update online status
function updateOnlineStatus() {
    const isOnline = navigator.onLine;
    const statusElement = document.getElementById('onlineStatus');
    
    if (statusElement) {
        statusElement.textContent = isOnline ? 'Online' : 'Offline';
        statusElement.className = isOnline ? 'text-green-500' : 'text-red-500';
    }
    
    if (!isOnline) {
        showNotification('You are offline. Some features may not work.', 'warning');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for use in other modules
export {
    AppState,
    initApp,
    saveAppState,
    showNotification,
    formatTime
};
