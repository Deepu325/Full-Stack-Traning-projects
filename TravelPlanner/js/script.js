// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Get data from localStorage
 * @param {string} key - The key to retrieve
 * @returns {any} - Parsed data or null
 */
function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

/**
 * Save data to localStorage
 * @param {string} key - The key to store
 * @param {any} value - The value to store
 */
function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Show error message in form
 * @param {string} elementId - Error element ID
 * @param {string} message - Error message
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Clear all error messages
 */
function clearErrors() {
    const errors = document.querySelectorAll('.error-message');
    errors.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
function isLoggedIn() {
    return getFromStorage('currentUser') !== null;
}

/**
 * Redirect to login if not authenticated
 */
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

/**
 * Generate unique ID
 * @returns {string}
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format date to readable string
 * @param {string} dateString - Date string
 * @returns {string}
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ===================================
// AUTHENTICATION FUNCTIONS
// ===================================

/**
 * Register new user
 * @param {Object} userData - User data
 * @returns {boolean}
 */
function registerUser(userData) {
    // Get existing users or initialize empty array
    let users = getFromStorage('users') || [];
    
    // Check if email already exists
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
        return false;
    }
    
    // Add new user
    const newUser = {
        id: generateId(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveToStorage('users', users);
    return true;
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null}
 */
function loginUser(email, password) {
    const users = getFromStorage('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save current user (without password)
        const currentUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        saveToStorage('currentUser', currentUser);
        return currentUser;
    }
    
    return null;
}

/**
 * Logout user
 */
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ===================================
// TRIP MANAGEMENT FUNCTIONS
// ===================================

/**
 * Get all trips for current user
 * @returns {Array}
 */
function getUserTrips() {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return [];
    
    const allTrips = getFromStorage('trips') || [];
    return allTrips.filter(trip => trip.userId === currentUser.id);
}

/**
 * Add new trip
 * @param {Object} tripData - Trip data
 */
function addTrip(tripData) {
    const currentUser = getFromStorage('currentUser');
    if (!currentUser) return;
    
    const allTrips = getFromStorage('trips') || [];
    
    const newTrip = {
        id: generateId(),
        userId: currentUser.id,
        destination: tripData.destination,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        budget: parseFloat(tripData.budget),
        description: tripData.description,
        status: tripData.status,
        createdAt: new Date().toISOString()
    };
    
    allTrips.push(newTrip);
    saveToStorage('trips', allTrips);
}

/**
 * Update existing trip
 * @param {string} tripId - Trip ID
 * @param {Object} tripData - Updated trip data
 */
function updateTrip(tripId, tripData) {
    const allTrips = getFromStorage('trips') || [];
    const tripIndex = allTrips.findIndex(trip => trip.id === tripId);
    
    if (tripIndex !== -1) {
        allTrips[tripIndex] = {
            ...allTrips[tripIndex],
            destination: tripData.destination,
            startDate: tripData.startDate,
            endDate: tripData.endDate,
            budget: parseFloat(tripData.budget),
            description: tripData.description,
            status: tripData.status
        };
        saveToStorage('trips', allTrips);
    }
}

/**
 * Delete trip
 * @param {string} tripId - Trip ID
 */
function deleteTrip(tripId) {
    const allTrips = getFromStorage('trips') || [];
    const filteredTrips = allTrips.filter(trip => trip.id !== tripId);
    saveToStorage('trips', filteredTrips);
}

/**
 * Get trip statistics
 * @returns {Object}
 */
function getTripStats() {
    const trips = getUserTrips();
    
    return {
        total: trips.length,
        upcoming: trips.filter(t => t.status === 'upcoming').length,
        completed: trips.filter(t => t.status === 'completed').length,
        totalBudget: trips.reduce((sum, t) => sum + t.budget, 0)
    };
}

// ===================================
// UI RENDERING FUNCTIONS
// ===================================

/**
 * Render trip card
 * @param {Object} trip - Trip object
 * @returns {string} - HTML string
 */
function renderTripCard(trip) {
    return `
        <div class="trip-card" data-trip-id="${trip.id}">
            <div class="trip-header">
                <h3 class="trip-destination">${trip.destination}</h3>
                <span class="trip-status ${trip.status}">${trip.status}</span>
            </div>
            <p class="trip-dates">
                📅 ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}
            </p>
            <p class="trip-description">${trip.description || 'No description'}</p>
            <p class="trip-budget">💰 $${trip.budget.toLocaleString()}</p>
            <div class="trip-actions">
                <button class="btn btn-small btn-edit" onclick="openEditModal('${trip.id}')">Edit</button>
                <button class="btn btn-small btn-delete" onclick="confirmDeleteTrip('${trip.id}')">Delete</button>
            </div>
        </div>
    `;
}

/**
 * Display trips in container
 * @param {Array} trips - Array of trips
 * @param {string} containerId - Container element ID
 */
function displayTrips(trips, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (trips.length === 0) {
        const noTripsMsg = document.getElementById('noTripsMsg') || document.getElementById('noTripsMessage');
        if (noTripsMsg) {
            noTripsMsg.style.display = 'block';
        }
        container.innerHTML = '';
        return;
    }
    
    const noTripsMsg = document.getElementById('noTripsMsg') || document.getElementById('noTripsMessage');
    if (noTripsMsg) {
        noTripsMsg.style.display = 'none';
    }
    
    container.innerHTML = trips.map(trip => renderTripCard(trip)).join('');
}

/**
 * Update dashboard statistics
 */
function updateDashboardStats() {
    const stats = getTripStats();
    
    const totalTripsEl = document.getElementById('totalTrips');
    const upcomingTripsEl = document.getElementById('upcomingTrips');
    const completedTripsEl = document.getElementById('completedTrips');
    const totalBudgetEl = document.getElementById('totalBudget');
    
    if (totalTripsEl) totalTripsEl.textContent = stats.total;
    if (upcomingTripsEl) upcomingTripsEl.textContent = stats.upcoming;
    if (completedTripsEl) completedTripsEl.textContent = stats.completed;
    if (totalBudgetEl) totalBudgetEl.textContent = `$${stats.totalBudget.toLocaleString()}`;
}

// ===================================
// PAGE-SPECIFIC INITIALIZATION
// ===================================

// REGISTER PAGE
if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        let isValid = true;
        
        if (name.length < 2) {
            showError('nameError', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        if (!email.includes('@')) {
            showError('regEmailError', 'Please enter a valid email');
            isValid = false;
        }
        
        if (password.length < 6) {
            showError('regPasswordError', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Register user
        const success = registerUser({ name, email, password });
        
        if (success) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            showError('regEmailError', 'Email already exists');
        }
    });
}

// LOGIN PAGE
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Validation
        if (!email || !password) {
            showError('emailError', 'Please fill in all fields');
            return;
        }
        
        // Login user
        const user = loginUser(email, password);
        
        if (user) {
            window.location.href = 'dashboard.html';
        } else {
            showError('passwordError', 'Invalid email or password');
        }
    });
}

// DASHBOARD PAGE
if (window.location.pathname.includes('dashboard.html')) {
    requireAuth();
    
    const currentUser = getFromStorage('currentUser');
    const userNameEl = document.getElementById('userName');
    if (userNameEl && currentUser) {
        userNameEl.textContent = currentUser.name;
    }
    
    // Update statistics
    updateDashboardStats();
    
    // Display recent trips (max 6)
    const trips = getUserTrips().slice(0, 6);
    displayTrips(trips, 'recentTripsContainer');
}

// TRIPS PAGE
if (window.location.pathname.includes('trips.html')) {
    requireAuth();
    
    let currentFilter = 'all';
    
    // Display all trips initially
    function refreshTrips() {
        let trips = getUserTrips();
        
        // Apply filter
        if (currentFilter === 'upcoming') {
            trips = trips.filter(t => t.status === 'upcoming');
        } else if (currentFilter === 'completed') {
            trips = trips.filter(t => t.status === 'completed');
        }
        
        displayTrips(trips, 'tripsContainer');
    }
    
    refreshTrips();
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            refreshTrips();
        });
    });
    
    // Add Trip Modal
    const addTripModal = document.getElementById('addTripModal');
    const openModalBtn = document.getElementById('openAddTripModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    
    openModalBtn.addEventListener('click', () => {
        addTripModal.classList.add('show');
    });
    
    closeModalBtn.addEventListener('click', () => {
        addTripModal.classList.remove('show');
    });
    
    cancelBtn.addEventListener('click', () => {
        addTripModal.classList.remove('show');
    });
    
    // Close modal on outside click
    addTripModal.addEventListener('click', (e) => {
        if (e.target === addTripModal) {
            addTripModal.classList.remove('show');
        }
    });
    
    // Add Trip Form
    const addTripForm = document.getElementById('addTripForm');
    addTripForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tripData = {
            destination: document.getElementById('tripDestination').value.trim(),
            startDate: document.getElementById('tripStartDate').value,
            endDate: document.getElementById('tripEndDate').value,
            budget: document.getElementById('tripBudget').value,
            description: document.getElementById('tripDescription').value.trim(),
            status: document.getElementById('tripStatus').value
        };
        
        // Validate dates
        if (new Date(tripData.endDate) < new Date(tripData.startDate)) {
            alert('End date must be after start date');
            return;
        }
        
        addTrip(tripData);
        addTripModal.classList.remove('show');
        addTripForm.reset();
        refreshTrips();
        alert('Trip added successfully!');
    });
    
    // Edit Trip Modal
    const editTripModal = document.getElementById('editTripModal');
    const closeEditModalBtn = document.getElementById('closeEditModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    
    closeEditModalBtn.addEventListener('click', () => {
        editTripModal.classList.remove('show');
    });
    
    cancelEditBtn.addEventListener('click', () => {
        editTripModal.classList.remove('show');
    });
    
    editTripModal.addEventListener('click', (e) => {
        if (e.target === editTripModal) {
            editTripModal.classList.remove('show');
        }
    });
    
    // Edit Trip Form
    const editTripForm = document.getElementById('editTripForm');
    editTripForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tripId = document.getElementById('editTripId').value;
        const tripData = {
            destination: document.getElementById('editTripDestination').value.trim(),
            startDate: document.getElementById('editTripStartDate').value,
            endDate: document.getElementById('editTripEndDate').value,
            budget: document.getElementById('editTripBudget').value,
            description: document.getElementById('editTripDescription').value.trim(),
            status: document.getElementById('editTripStatus').value
        };
        
        // Validate dates
        if (new Date(tripData.endDate) < new Date(tripData.startDate)) {
            alert('End date must be after start date');
            return;
        }
        
        updateTrip(tripId, tripData);
        editTripModal.classList.remove('show');
        refreshTrips();
        alert('Trip updated successfully!');
    });
}

// ===================================
// GLOBAL FUNCTIONS (accessible from HTML)
// ===================================

/**
 * Open edit modal with trip data
 * @param {string} tripId - Trip ID
 */
function openEditModal(tripId) {
    const trips = getUserTrips();
    const trip = trips.find(t => t.id === tripId);
    
    if (!trip) return;
    
    document.getElementById('editTripId').value = trip.id;
    document.getElementById('editTripDestination').value = trip.destination;
    document.getElementById('editTripStartDate').value = trip.startDate;
    document.getElementById('editTripEndDate').value = trip.endDate;
    document.getElementById('editTripBudget').value = trip.budget;
    document.getElementById('editTripDescription').value = trip.description;
    document.getElementById('editTripStatus').value = trip.status;
    
    document.getElementById('editTripModal').classList.add('show');
}

/**
 * Confirm and delete trip
 * @param {string} tripId - Trip ID
 */
function confirmDeleteTrip(tripId) {
    if (confirm('Are you sure you want to delete this trip?')) {
        deleteTrip(tripId);
        
        // Refresh the page
        if (window.location.pathname.includes('trips.html')) {
            location.reload();
        } else if (window.location.pathname.includes('dashboard.html')) {
            location.reload();
        }
    }
}

// ===================================
// LOGOUT FUNCTIONALITY
// ===================================
const logoutBtns = document.querySelectorAll('#logoutBtn');
logoutBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            logoutUser();
        }
    });
});

// ===================================
// PREVENT ACCESS TO AUTH PAGES IF LOGGED IN
// ===================================
if ((window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) && isLoggedIn()) {
    window.location.href = 'dashboard.html';
}
