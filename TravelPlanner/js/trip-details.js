// ===================================
// TRIP DETAILS PAGE FUNCTIONALITY
// ===================================

let currentTripId = null;
let currentTrip = null;

// Get trip ID from URL
function getTripIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load trip details
async function loadTripDetails() {
    currentTripId = getTripIdFromURL();
    
    if (!currentTripId) {
        alert('No trip selected');
        window.location.href = 'trips.html';
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/trips/${currentTripId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.success) {
            currentTrip = data.data.trip;
            displayTripInfo(currentTrip);
            displayItinerary(data.data.itinerary || []);
            displayExpenses(data.data.expenses || []);
            calculateBudget(currentTrip.budget, data.data.expenses || []);
        }
    } catch (error) {
        console.error('Error loading trip:', error);
    }
}

// Display trip information
function displayTripInfo(trip) {
    document.getElementById('tripDestination').textContent = trip.destination;
    document.getElementById('tripDates').textContent = 
        `${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}`;
    
    const statusEl = document.getElementById('tripStatus');
    statusEl.textContent = trip.status;
    statusEl.className = `trip-status ${trip.status}`;
}

// Calculate and display budget
function calculateBudget(budget, expenses) {
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const remaining = budget - totalExpenses;
    const percentage = budget > 0 ? ((totalExpenses / budget) * 100).toFixed(1) : 0;

    document.getElementById('totalBudget').textContent = `$${parseFloat(budget).toLocaleString()}`;
    document.getElementById('totalExpenses').textContent = `$${totalExpenses.toLocaleString()}`;
    document.getElementById('remainingBudget').textContent = `$${remaining.toLocaleString()}`;
    document.getElementById('budgetPercentage').textContent = `${percentage}%`;
}

// Display itinerary
function displayItinerary(itinerary) {
    const container = document.getElementById('itineraryContainer');
    const noItinerary = document.getElementById('noItinerary');

    if (itinerary.length === 0) {
        container.style.display = 'none';
        noItinerary.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    noItinerary.style.display = 'none';

    // Group by day
    const byDay = {};
    itinerary.forEach(item => {
        if (!byDay[item.day_number]) {
            byDay[item.day_number] = [];
        }
        byDay[item.day_number].push(item);
    });

    let html = '';
    Object.keys(byDay).sort((a, b) => a - b).forEach(day => {
        html += `
            <div class="itinerary-day">
                <h3>Day ${day}</h3>
                <div class="itinerary-items">
        `;
        
        byDay[day].forEach(item => {
            html += `
                <div class="itinerary-item">
                    <div class="itinerary-time">${item.time || 'All day'}</div>
                    <div class="itinerary-content">
                        <h4>${item.activity}</h4>
                        ${item.location ? `<p>📍 ${item.location}</p>` : ''}
                    </div>
                    <div class="itinerary-actions">
                        <button class="btn-icon" onclick="deleteItinerary(${item.id})">🗑️</button>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Display expenses
function displayExpenses(expenses) {
    const container = document.getElementById('expensesContainer');
    const noExpenses = document.getElementById('noExpenses');

    if (expenses.length === 0) {
        container.style.display = 'none';
        noExpenses.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    noExpenses.style.display = 'none';

    let html = '<div class="expenses-list">';
    
    expenses.forEach(expense => {
        html += `
            <div class="expense-item">
                <div class="expense-icon">${getCategoryIcon(expense.category)}</div>
                <div class="expense-info">
                    <h4>${expense.expense_name}</h4>
                    <p>${expense.category} • ${formatDate(expense.date)}</p>
                    ${expense.notes ? `<p class="expense-notes">${expense.notes}</p>` : ''}
                </div>
                <div class="expense-amount">$${parseFloat(expense.amount).toLocaleString()}</div>
                <div class="expense-actions">
                    <button class="btn-icon" onclick="deleteExpense(${expense.id})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        accommodation: '🏨',
        food: '🍽️',
        transport: '🚗',
        activities: '🎭',
        shopping: '🛍️',
        other: '💳'
    };
    return icons[category] || '💳';
}

// Tab switching
document.querySelectorAll('.details-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('.details-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load specific content
        if (tabName === 'weather') {
            loadWeather();
        } else if (tabName === 'map') {
            loadMap();
        } else if (tabName === 'checklist') {
            loadChecklist();
        }
    });
});

// Add itinerary modal
const itineraryModal = document.getElementById('itineraryModal');
const addItineraryBtn = document.getElementById('addItineraryBtn');
const closeItineraryModal = document.getElementById('closeItineraryModal');
const cancelItinerary = document.getElementById('cancelItinerary');

addItineraryBtn.addEventListener('click', () => {
    itineraryModal.classList.add('show');
});

closeItineraryModal.addEventListener('click', () => {
    itineraryModal.classList.remove('show');
});

cancelItinerary.addEventListener('click', () => {
    itineraryModal.classList.remove('show');
});

// Add itinerary form
document.getElementById('itineraryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        day_number: document.getElementById('dayNumber').value,
        activity: document.getElementById('activity').value,
        time: document.getElementById('activityTime').value,
        location: document.getElementById('location').value
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/trips/${currentTripId}/itinerary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (result.success) {
            itineraryModal.classList.remove('show');
            document.getElementById('itineraryForm').reset();
            loadTripDetails();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error adding itinerary:', error);
        alert('Failed to add activity');
    }
});

// Add expense modal
const expenseModal = document.getElementById('expenseModal');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const closeExpenseModal = document.getElementById('closeExpenseModal');
const cancelExpense = document.getElementById('cancelExpense');

addExpenseBtn.addEventListener('click', () => {
    expenseModal.classList.add('show');
});

closeExpenseModal.addEventListener('click', () => {
    expenseModal.classList.remove('show');
});

cancelExpense.addEventListener('click', () => {
    expenseModal.classList.remove('show');
});

// Add expense form
document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        expense_name: document.getElementById('expenseName').value,
        amount: document.getElementById('expenseAmount').value,
        category: document.getElementById('expenseCategory').value,
        date: document.getElementById('expenseDate').value,
        notes: document.getElementById('expenseNotes').value
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/trips/${currentTripId}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (result.success) {
            expenseModal.classList.remove('show');
            document.getElementById('expenseForm').reset();
            loadTripDetails();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('Failed to add expense');
    }
});

// Delete itinerary
async function deleteItinerary(id) {
    if (!confirm('Delete this activity?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/itinerary/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        
        if (result.success) {
            loadTripDetails();
        }
    } catch (error) {
        console.error('Error deleting itinerary:', error);
    }
}

// Delete expense
async function deleteExpense(id) {
    if (!confirm('Delete this expense?')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        
        if (result.success) {
            loadTripDetails();
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

// Load weather (placeholder)
function loadWeather() {
    const container = document.getElementById('weatherContainer');
    container.innerHTML = `
        <div class="weather-info">
            <h3>Weather information coming soon!</h3>
            <p>Integrate with OpenWeatherMap API to show weather forecast</p>
        </div>
    `;
}

// Load map (placeholder)
function loadMap() {
    const container = document.getElementById('mapContainer');
    container.innerHTML = `
        <div class="map-info">
            <h3>Map view coming soon!</h3>
            <p>Integrate with Google Maps API to show destination</p>
        </div>
    `;
}

// Load checklist (placeholder)
function loadChecklist() {
    const container = document.getElementById('checklistContainer');
    const noChecklist = document.getElementById('noChecklist');
    
    container.style.display = 'none';
    noChecklist.style.display = 'block';
}

// Format date helper
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize on page load
if (window.location.pathname.includes('trip-details.html')) {
    loadTripDetails();
}
