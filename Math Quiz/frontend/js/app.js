/**
 * Math Puzzle Quiz - Frontend JavaScript
 * Handles all frontend functionality including authentication, quiz display, and scoring
 */

const API_BASE = 'http://localhost:8080/api';

// Global variables
let currentUser = null;
let currentQuiz = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let timer = null;
let timeLeft = 30;
let selectedAnswers = [];
let quizStartTime = null;
let currentCategory = '';
let currentDifficulty = '';

// DOM Elements - Pages
const loginPage = document.getElementById('login');
const registerPage = document.getElementById('register');
const dashboardPage = document.getElementById('dashboard');
const quizPage = document.getElementById('quiz');
const resultsPage = document.getElementById('results');
const leaderboardPage = document.getElementById('leaderboard');
const statsPage = document.getElementById('stats');

// DOM Elements - Forms and buttons
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const logoutBtn = document.querySelector('.logout-btn');
const viewStatsBtn = document.getElementById('viewStats');

// DOM Elements - Quiz
const userNameSpan = document.getElementById('userName');
const categoriesDiv = document.getElementById('categories');
const questionDiv = document.getElementById('question');
const optionsDiv = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const skipBtn = document.getElementById('skipBtn');
const progressBar = document.getElementById('progressBar');
const questionCounter = document.getElementById('questionCounter');
const timeLeftSpan = document.getElementById('timeLeft');
const categorySpan = document.getElementById('categorySpan');
const difficultySpan = document.getElementById('difficultySpan');

// DOM Elements - Results and Leaderboard
const finalScoreSpan = document.getElementById('finalScore');
const correctAnswersSpan = document.getElementById('correctAnswers');
const accuracySpan = document.getElementById('accuracy');
const timeSpentSpan = document.getElementById('timeSpent');
const backToDashboardBtn = document.getElementById('backToDashboard');
const leaderboardList = document.getElementById('leaderboardList');
const statsContent = document.getElementById('statsContent');
const backFromStatsBtn = document.getElementById('backFromStats');

// Event Listeners
if (loginForm) loginForm.addEventListener('submit', handleLogin);
if (registerForm) registerForm.addEventListener('submit', handleRegister);
if (showRegisterLink) showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showPage(registerPage); });
if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showPage(loginPage); });
if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
if (prevBtn) prevBtn.addEventListener('click', previousQuestion);
if (skipBtn) skipBtn.addEventListener('click', skipQuestion);
if (backToDashboardBtn) backToDashboardBtn.addEventListener('click', backToDashboard);
if (viewStatsBtn) viewStatsBtn.addEventListener('click', loadUserStats);
if (backFromStatsBtn) backFromStatsBtn.addEventListener('click', () => showPage(dashboardPage));

/**
 * Display the appropriate page and hide others
 * @param {HTMLElement} page - The page element to display
 */
function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    if (page) page.classList.remove('hidden');
}

/**
 * Handle user login
 * @param {Event} e - Form submission event
 */
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showAlert('Please enter both username and password', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data;
            localStorage.setItem('user', JSON.stringify(currentUser));
            userNameSpan.textContent = currentUser.username;
            loginForm.reset();
            loadDashboard();
            showPage(dashboardPage);
            showAlert('Login successful!', 'success');
        } else {
            showAlert(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Connection error. Please try again.', 'error');
    }
}

/**
 * Handle user registration
 * @param {Event} e - Form submission event
 */
async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    // Validation
    if (!username || !email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('Please enter a valid email', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Registration successful! Please login.', 'success');
            registerForm.reset();
            showPage(loginPage);
        } else {
            showAlert(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Connection error. Please try again.', 'error');
    }
}

/**
 * Handle user logout
 */
function handleLogout() {
    // Reset to guest user
    createGuestUser();
    showAlert('Reset to guest mode', 'success');
}

/**
 * Load the dashboard with quiz categories
 */
async function loadDashboard() {
    if (!currentUser) {
        showPage(loginPage);
        return;
    }

    const quizOptions = `
        <div class="quiz-option">
            <h3>Arithmetic</h3>
            <p>Test your basic math skills</p>
            <div class="difficulty-buttons">
                <button class="category-btn" data-category="1" data-difficulty="Easy">Easy</button>
                <button class="category-btn" data-category="1" data-difficulty="Medium">Medium</button>
                <button class="category-btn" data-category="1" data-difficulty="Hard">Hard</button>
            </div>
        </div>
        <div class="quiz-option">
            <h3>Logical Reasoning</h3>
            <p>Enhance your logic and problem-solving</p>
            <div class="difficulty-buttons">
                <button class="category-btn" data-category="2" data-difficulty="Easy">Easy</button>
                <button class="category-btn" data-category="2" data-difficulty="Medium">Medium</button>
                <button class="category-btn" data-category="2" data-difficulty="Hard">Hard</button>
            </div>
        </div>
        <div class="quiz-option">
            <h3>Number Patterns</h3>
            <p>Identify and complete number sequences</p>
            <div class="difficulty-buttons">
                <button class="category-btn" data-category="3" data-difficulty="Easy">Easy</button>
                <button class="category-btn" data-category="3" data-difficulty="Medium">Medium</button>
                <button class="category-btn" data-category="3" data-difficulty="Hard">Hard</button>
            </div>
        </div>
        <div class="quiz-option">
            <h3>Time Challenges</h3>
            <p>Race against the clock</p>
            <div class="difficulty-buttons">
                <button class="category-btn" data-category="4" data-difficulty="Easy">Easy</button>
                <button class="category-btn" data-category="4" data-difficulty="Medium">Medium</button>
                <button class="category-btn" data-category="4" data-difficulty="Hard">Hard</button>
            </div>
        </div>
        <div class="dashboard-actions">
            <button id="viewLeaderboard" class="action-btn leaderboard-btn">
                <span>👑</span> View Leaderboard
            </button>
            <button id="viewStats" class="action-btn stats-btn">
                <span>📊</span> My Statistics
            </button>
        </div>
    `;

    categoriesDiv.innerHTML = quizOptions;

    // Add event listeners to category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', startQuiz);
    });

    // Add event listeners to action buttons
    document.getElementById('viewLeaderboard').addEventListener('click', loadLeaderboard);
    if (document.getElementById('viewStats')) {
        document.getElementById('viewStats').addEventListener('click', loadUserStats);
    }

    showPage(dashboardPage);
}

// Fallback local questions when backend is unavailable
const LOCAL_QUESTIONS = {
    '1': {
        'Easy': [
            { id: 1, question_text: 'What is 15 + 23?', options: '["36","38","40","42"]', correct_answer: '38', explanation: '15 + 23 = 38', time_limit: 30 },
            { id: 2, question_text: 'What is 50 - 17?', options: '["33","32","35","34"]', correct_answer: '33', explanation: '50 - 17 = 33', time_limit: 30 },
            { id: 3, question_text: 'What is 8 × 6?', options: '["44","48","52","45"]', correct_answer: '48', explanation: '8 × 6 = 48', time_limit: 30 },
            { id: 4, question_text: 'What is 144 ÷ 12?', options: '["11","12","13","14"]', correct_answer: '12', explanation: '144 ÷ 12 = 12', time_limit: 30 },
            { id: 5, question_text: 'What is 9 + 11 + 5?', options: '["24","25","26","27"]', correct_answer: '25', explanation: '9 + 11 + 5 = 25', time_limit: 30 }
        ],
        'Medium': [
            { id: 6, question_text: 'What is 23 × 15?', options: '["335","340","345","350"]', correct_answer: '345', explanation: '23 × 15 = 345', time_limit: 40 },
            { id: 7, question_text: 'What is 15% of 200?', options: '["20","25","30","35"]', correct_answer: '30', explanation: '15/100 × 200 = 30', time_limit: 40 },
            { id: 8, question_text: 'What is 456 ÷ 8?', options: '["56","57","58","59"]', correct_answer: '57', explanation: '456 ÷ 8 = 57', time_limit: 40 },
            { id: 9, question_text: 'If 2x - 5 = 15, what is x?', options: '["8","9","10","11"]', correct_answer: '10', explanation: '2x = 20, x = 10', time_limit: 45 },
            { id: 10, question_text: 'What is 3² + 4²?', options: '["20","25","30","35"]', correct_answer: '25', explanation: '9 + 16 = 25', time_limit: 40 }
        ],
        'Hard': [
            { id: 11, question_text: 'What is 128 × 125 ÷ 100?', options: '["160","165","170","175"]', correct_answer: '160', explanation: '128×125=16000, ÷100=160', time_limit: 50 },
            { id: 12, question_text: 'The sum of three consecutive numbers is 54. What is the largest?', options: '["17","18","19","20"]', correct_answer: '19', explanation: 'x+(x+1)+(x+2)=54, x=17, largest=19', time_limit: 50 },
            { id: 13, question_text: 'What is √144?', options: '["10","11","12","13"]', correct_answer: '12', explanation: '12×12=144', time_limit: 45 },
            { id: 14, question_text: 'A product costs 250 with 20% discount. Final price?', options: '["180","190","200","210"]', correct_answer: '200', explanation: '250 - 50 = 200', time_limit: 50 },
            { id: 15, question_text: 'What is (5 + 3)² - 4?', options: '["60","64","68","72"]', correct_answer: '60', explanation: '8²-4=64-4=60', time_limit: 50 }
        ]
    },
    '2': {
        'Easy': [
            { id: 16, question_text: 'If all cats are animals and all animals are living things, then all cats are?', options: '["living things","pets","mammals","furry"]', correct_answer: 'living things', explanation: 'cats→animals→living things', time_limit: 30 },
            { id: 17, question_text: 'Which number comes next: 2, 4, 6, 8, ?', options: '["9","10","11","12"]', correct_answer: '10', explanation: 'Even numbers +2 each time', time_limit: 30 },
            { id: 18, question_text: 'If A > B and B > C, then A compared to C is?', options: '["taller","shorter","equal","unknown"]', correct_answer: 'taller', explanation: 'Transitive property: A > C', time_limit: 30 },
            { id: 19, question_text: 'What comes next: A, B, C, D, ?', options: '["E","F","G","H"]', correct_answer: 'E', explanation: 'Alphabetical sequence', time_limit: 30 },
            { id: 20, question_text: 'John is Sam\'s father, Sam is Maya\'s mother. John is Maya\'s?', options: '["father","grandfather","uncle","brother"]', correct_answer: 'grandfather', explanation: 'John→Sam→Maya', time_limit: 30 }
        ],
        'Medium': [
            { id: 21, question_text: '3 people paint a house in 4 days. How many for 2 days?', options: '["4","5","6","7"]', correct_answer: '6', explanation: '3×4=12 person-days, 12÷2=6', time_limit: 40 },
            { id: 22, question_text: 'Which does not belong: 2, 3, 5, 7, 11, 15?', options: '["15","11","7","5"]', correct_answer: '15', explanation: '15=3×5, not prime', time_limit: 45 },
            { id: 23, question_text: 'A man walks 5km N, 3km W, 5km S. Distance from start?', options: '["3 km","8 km","13 km","5 km"]', correct_answer: '3 km', explanation: 'N and S cancel, left 3km W', time_limit: 45 },
            { id: 24, question_text: 'Day before yesterday was Saturday. What is tomorrow?', options: '["Tuesday","Wednesday","Thursday","Friday"]', correct_answer: 'Tuesday', explanation: 'Sat→Sun→Mon→Tue', time_limit: 50 },
            { id: 25, question_text: 'If BOOK = 2-15-15-11, CAT = ?', options: '["3-1-20","2-1-19","3-1-19","2-1-20"]', correct_answer: '3-1-20', explanation: 'C=3,A=1,T=20', time_limit: 45 }
        ],
        'Hard': [
            { id: 26, question_text: 'A before B, B before C, D before A. Order?', options: '["A-B-C-D","D-A-B-C","B-D-A-C","C-B-D-A"]', correct_answer: 'D-A-B-C', explanation: 'D<A<B<C', time_limit: 50 },
            { id: 27, question_text: 'All roses are flowers, some flowers are red. Are some roses red?', options: '["All roses are red","Some roses are red","No roses are red","Cannot be determined"]', correct_answer: 'Cannot be determined', explanation: 'Cannot confirm roses are red', time_limit: 50 },
            { id: 28, question_text: 'A=2B, B=C/2, C=3D/4, D=40. What is A?', options: '["15","20","30","25"]', correct_answer: '30', explanation: 'D=40,C=30,B=15,A=30', time_limit: 55 },
            { id: 29, question_text: 'In a class, 60% passed math, 70% passed science, at least what % passed both?', options: '["10%","20%","30%","40%"]', correct_answer: '30%', explanation: '60+70-100=30%', time_limit: 55 },
            { id: 30, question_text: 'If 5 machines make 5 parts in 5 mins, how long for 100 machines to make 100 parts?', options: '["1 min","5 min","10 min","100 min"]', correct_answer: '5 min', explanation: 'Each machine makes 1 part in 5 min', time_limit: 55 }
        ]
    },
    '3': {
        'Easy': [
            { id: 31, question_text: 'What comes next: 1, 2, 3, 4, ?', options: '["5","6","7","8"]', correct_answer: '5', explanation: '+1 each time', time_limit: 30 },
            { id: 32, question_text: 'What comes next: 2, 4, 6, 8, ?', options: '["9","10","12","14"]', correct_answer: '10', explanation: 'Even numbers +2', time_limit: 30 },
            { id: 33, question_text: 'What comes next: 1, 1, 2, 3, 5, ?', options: '["8","9","10","12"]', correct_answer: '8', explanation: 'Fibonacci: 3+5=8', time_limit: 30 },
            { id: 34, question_text: 'What comes next: 10, 9, 8, 7, ?', options: '["5","6","7","8"]', correct_answer: '6', explanation: '-1 each time', time_limit: 30 },
            { id: 35, question_text: 'What comes next: 1, 4, 9, 16, ?', options: '["25","26","27","28"]', correct_answer: '25', explanation: 'Perfect squares: 5²=25', time_limit: 30 }
        ],
        'Medium': [
            { id: 36, question_text: 'What comes next: 1, 4, 7, 10, 13, ?', options: '["16","17","18","19"]', correct_answer: '16', explanation: '+3 each time', time_limit: 40 },
            { id: 37, question_text: 'What comes next: 1, 2, 4, 8, 16, ?', options: '["24","30","32","36"]', correct_answer: '32', explanation: '×2 each time', time_limit: 40 },
            { id: 38, question_text: 'What comes next: 2, 5, 10, 17, 26, ?', options: '["35","36","37","38"]', correct_answer: '37', explanation: 'Differences: 3,5,7,9,11 → 26+11=37', time_limit: 45 },
            { id: 39, question_text: 'What comes next: 1, 3, 6, 10, 15, ?', options: '["20","21","22","24"]', correct_answer: '21', explanation: 'Triangular numbers: +6', time_limit: 45 },
            { id: 40, question_text: 'What comes next: 5, 10, 20, 40, ?', options: '["80","85","90","95"]', correct_answer: '80', explanation: '×2 each time', time_limit: 40 }
        ],
        'Hard': [
            { id: 41, question_text: 'What comes next: 2, 3, 5, 7, 11, 13, ?', options: '["15","17","19","21"]', correct_answer: '17', explanation: 'Prime numbers', time_limit: 50 },
            { id: 42, question_text: 'What comes next: 1, 1, 2, 3, 5, 8, 13, ?', options: '["19","20","21","22"]', correct_answer: '21', explanation: 'Fibonacci: 8+13=21', time_limit: 50 },
            { id: 43, question_text: 'What comes next: 1, 4, 9, 16, 25, 36, ?', options: '["48","49","50","51"]', correct_answer: '49', explanation: '7²=49', time_limit: 50 },
            { id: 44, question_text: 'What comes next: 1, 3, 7, 15, 31, ?', options: '["61","62","63","64"]', correct_answer: '63', explanation: '2ⁿ-1: 2⁶-1=63', time_limit: 55 },
            { id: 45, question_text: 'What comes next: 2, 6, 12, 20, 30, ?', options: '["40","41","42","43"]', correct_answer: '42', explanation: 'n(n+1): 6×7=42', time_limit: 55 }
        ]
    },
    '4': {
        'Easy': [
            { id: 46, question_text: 'Quick: 7 + 3 = ?', options: '["9","10","11","12"]', correct_answer: '10', explanation: '7+3=10', time_limit: 20 },
            { id: 47, question_text: 'Quick: 20 - 8 = ?', options: '["10","11","12","13"]', correct_answer: '12', explanation: '20-8=12', time_limit: 20 },
            { id: 48, question_text: 'Quick: 6 × 4 = ?', options: '["20","24","28","32"]', correct_answer: '24', explanation: '6×4=24', time_limit: 20 },
            { id: 49, question_text: 'Quick: 30 ÷ 5 = ?', options: '["5","6","7","8"]', correct_answer: '6', explanation: '30÷5=6', time_limit: 20 },
            { id: 50, question_text: 'Quick: 9 + 11 + 10 = ?', options: '["28","29","30","31"]', correct_answer: '30', explanation: '9+11+10=30', time_limit: 20 }
        ],
        'Medium': [
            { id: 51, question_text: 'Quick: 45 ÷ 9 + 5 = ?', options: '["10","11","12","13"]', correct_answer: '10', explanation: '5+5=10', time_limit: 25 },
            { id: 52, question_text: 'Quick: 8 × 7 - 14 = ?', options: '["34","42","50","56"]', correct_answer: '42', explanation: '56-14=42', time_limit: 25 },
            { id: 53, question_text: 'Quick: 25% of 80 = ?', options: '["15","20","25","30"]', correct_answer: '20', explanation: '0.25×80=20', time_limit: 25 },
            { id: 54, question_text: 'Quick: 12² + 5 = ?', options: '["144","149","154","159"]', correct_answer: '149', explanation: '144+5=149', time_limit: 25 },
            { id: 55, question_text: 'Quick: 100 - 23 - 17 = ?', options: '["50","55","60","65"]', correct_answer: '60', explanation: '77-17=60', time_limit: 25 }
        ],
        'Hard': [
            { id: 56, question_text: 'Quick: (9 + 3) × 2 - 8 = ?', options: '["16","20","24","28"]', correct_answer: '16', explanation: '12×2-8=16', time_limit: 30 },
            { id: 57, question_text: 'Quick: 176 ÷ 8 + 5 = ?', options: '["27","28","29","30"]', correct_answer: '27', explanation: '22+5=27', time_limit: 30 },
            { id: 58, question_text: 'Quick: 15% of 200 + 50 = ?', options: '["80","100","130","150"]', correct_answer: '80', explanation: '30+50=80', time_limit: 30 },
            { id: 59, question_text: 'Quick: (7 × 8) - (6 × 5) = ?', options: '["26","30","34","38"]', correct_answer: '26', explanation: '56-30=26', time_limit: 30 },
            { id: 60, question_text: 'Quick: 2³ + 3² + 4 = ?', options: '["17","21","25","28"]', correct_answer: '21', explanation: '8+9+4=21', time_limit: 30 }
        ]
    }
};

function getLocalQuestions(categoryId, difficulty) {
    const pool = (LOCAL_QUESTIONS[categoryId] || {})[difficulty] || [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
}

/**
 * Start a quiz with selected category and difficulty
 * @param {Event} e - Button click event
 */
async function startQuiz(e) {
    const categoryId = e.target.dataset.category;
    const difficulty = e.target.dataset.difficulty;

    const categoryNames = { '1': 'Arithmetic', '2': 'Logical Reasoning', '3': 'Number Patterns', '4': 'Time Challenges' };
    currentCategory = categoryNames[categoryId];
    currentDifficulty = difficulty;

    try {
        const response = await fetch(`${API_BASE}/quiz/questions?categoryId=${categoryId}&difficulty=${difficulty}&count=5`);
        const data = await response.json();

        if (response.ok && Array.isArray(data) && data.length > 0) {
            currentQuiz = data;
        } else {
            currentQuiz = getLocalQuestions(categoryId, difficulty);
        }
    } catch (error) {
        currentQuiz = getLocalQuestions(categoryId, difficulty);
    }

    if (currentQuiz.length === 0) {
        showAlert('No questions available for this selection', 'error');
        return;
    }

    currentQuestionIndex = 0;
    quizScore = 0;
    selectedAnswers = new Array(currentQuiz.length).fill(null);
    quizStartTime = new Date();

    updateQuizHeader();
    showQuestion();
    showPage(quizPage);
}

/**
 * Update quiz header information
 */
function updateQuizHeader() {
    if (categorySpan) categorySpan.textContent = currentCategory;
    if (difficultySpan) difficultySpan.textContent = currentDifficulty;
}

/**
 * Display current question
 */
function showQuestion() {
    if (currentQuestionIndex >= currentQuiz.length) {
        endQuiz();
        return;
    }

    const question = currentQuiz[currentQuestionIndex];
    
    // Update question display
    questionDiv.innerHTML = `
        <div class="question-text">
            <strong>Question ${currentQuestionIndex + 1}:</strong> ${question.question_text}
        </div>
    `;

    // Parse and display options
    let options = [];
    try {
        options = JSON.parse(question.options);
    } catch (e) {
        options = question.options.split(',').map(opt => opt.trim());
    }

    optionsDiv.innerHTML = options.map((opt, index) =>
        `<div class="option" data-index="${index}">
            <input type="radio" name="answer" id="option${index}" value="${opt}">
            <label for="option${index}">${opt}</label>
        </div>`
    ).join('');

    // Restore previously selected answer if any
    if (selectedAnswers[currentQuestionIndex]) {
        const selectedInput = document.querySelector(`input[value="${selectedAnswers[currentQuestionIndex]}"]`);
        if (selectedInput) selectedInput.checked = true;
    }

    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener('change', (e) => {
            selectedAnswers[currentQuestionIndex] = e.target.value;
            nextBtn.disabled = false;
        });
    });

    // Update progress
    updateProgress();

    // Start timer
    timeLeft = question.time_limit || 30;
    timeLeftSpan.textContent = timeLeft;
    startTimer();
    nextBtn.disabled = !selectedAnswers[currentQuestionIndex];
    prevBtn.disabled = currentQuestionIndex === 0;
}

/**
 * Update progress bar
 */
function updateProgress() {
    const progress = ((currentQuestionIndex) / currentQuiz.length) * 100;
    if (progressBar) progressBar.style.width = progress + '%';
    if (questionCounter) questionCounter.textContent = `${currentQuestionIndex + 1} / ${currentQuiz.length}`;
}

/**
 * Start countdown timer for question
 */
function startTimer() {
    if (timer) clearInterval(timer);
    
    timer = setInterval(() => {
        timeLeft--;
        timeLeftSpan.textContent = timeLeft;

        if (timeLeft <= 5) {
            timeLeftSpan.style.color = '#e74c3c';
        } else {
            timeLeftSpan.style.color = '#2ecc71';
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

/**
 * Move to next question
 */
async function nextQuestion() {
    clearInterval(timer);
    
    if (currentQuestionIndex < currentQuiz.length) {
        const question = currentQuiz[currentQuestionIndex];
        const userAnswer = selectedAnswers[currentQuestionIndex];

        if (userAnswer) {
            const timeTaken = Math.max(1, (question.time_limit || 30) - timeLeft);
            try {
                const response = await fetch(`${API_BASE}/quiz/validate-answer`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ questionId: question.id, userAnswer })
                });
                const result = await response.json();
                if (result.isCorrect) quizScore += result.score;
                await submitScore(question.id, result.score, timeTaken);
            } catch (error) {
                // Offline fallback: check answer locally
                const isCorrect = userAnswer.trim().toLowerCase() === (question.correct_answer || '').trim().toLowerCase();
                if (isCorrect) quizScore += 10;
            }
        }
    }

    currentQuestionIndex++;
    
    if (currentQuestionIndex >= currentQuiz.length) {
        endQuiz();
    } else {
        showQuestion();
    }
}

/**
 * Move to previous question
 */
function previousQuestion() {
    clearInterval(timer);
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

/**
 * Skip current question
 */
function skipQuestion() {
    nextQuestion();
}

/**
 * Submit score to backend
 * @param {number} questionId - ID of the question
 * @param {number} points - Points earned
 * @param {number} timeTaken - Time taken in seconds
 */
async function submitScore(questionId, points, timeTaken) {
    // Skip score submission for guest users (no database entry)
    if (!currentUser || currentUser.isGuest) {
        return;
    }

    try {
        await fetch(`${API_BASE}/scores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                questionId,
                score: points,
                timeTaken
            })
        });
    } catch (error) {
        console.error('Error submitting score:', error);
    }
}

/**
 * End quiz and display results
 */
function endQuiz() {
    clearInterval(timer);

    const totalTime = Math.round((new Date() - quizStartTime) / 1000);
    const correctCount = Math.round(quizScore / 10); // Each correct answer is 10 points
    const accuracy = Math.round((correctCount / currentQuiz.length) * 100);

    finalScoreSpan.textContent = quizScore;
    correctAnswersSpan.textContent = correctCount;
    accuracySpan.textContent = accuracy;
    timeSpentSpan.textContent = formatTime(totalTime);

    showPage(resultsPage);
}

/**
 * Format time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
}

/**
 * Go back to dashboard
 */
function backToDashboard() {
    clearInterval(timer);
    loadDashboard();
}

/**
 * Load and display leaderboard
 */
async function loadLeaderboard() {
    try {
        // Show message for guest users
        if (currentUser && currentUser.isGuest) {
            const guestMessage = `
                <div class="leaderboard-header">
                    <h2>Leaderboard</h2>
                    <p class="guest-info">📝 Note: Guest scores are not saved to the leaderboard.</p>
                    <p class="guest-info">Register an account to track your progress and compete with others!</p>
                </div>
                <div class="leaderboard-actions">
                    <button id="leaderboardBack" class="action-btn">Back to Dashboard</button>
                </div>
            `;
            leaderboardList.innerHTML = guestMessage;
            document.getElementById('leaderboardBack').addEventListener('click', loadDashboard);
            showPage(leaderboardPage);
            return;
        }

        const response = await fetch(`${API_BASE}/scores/leaderboard`);
        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
            let leaderboardHTML = `
                <div class="leaderboard-header">
                    <h2>Top Performers</h2>
                    <table class="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Total Score</th>
                                <th>Questions</th>
                                <th>Avg Score</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            data.forEach((user, index) => {
                const avgScore = user.avg_score ? user.avg_score.toFixed(2) : '0.00';
                leaderboardHTML += `
                    <tr class="${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : ''}">
                        <td class="rank">${index + 1}</td>
                        <td>${user.username}</td>
                        <td class="score">${user.total_score || 0}</td>
                        <td>${user.questions_attempted || 0}</td>
                        <td>${avgScore}</td>
                    </tr>
                `;
            });

            leaderboardHTML += `
                        </tbody>
                    </table>
                </div>
                <div class="leaderboard-actions">
                    <button id="leaderboardBack" class="action-btn">Back to Dashboard</button>
                </div>
            `;

            leaderboardList.innerHTML = leaderboardHTML;
            document.getElementById('leaderboardBack').addEventListener('click', loadDashboard);
            showPage(leaderboardPage);
        } else {
            showAlert('Failed to load leaderboard', 'error');
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        showAlert('Connection error. Please try again.', 'error');
    }
}

/**
 * Load and display user statistics
 */
async function loadUserStats() {
    if (!currentUser) return;

    // Show message for guest users
    if (currentUser.isGuest) {
        const guestMessage = `
            <div class="stats-container">
                <h2>Your Statistics</h2>
                <div class="guest-stats-message">
                    <p>📊 You are playing as a guest.</p>
                    <p>Guest statistics are not saved.</p>
                    <p>Register an account to track your progress and see detailed statistics!</p>
                </div>
                <button id="statsBack" class="action-btn">Back to Dashboard</button>
            </div>
        `;
        statsContent.innerHTML = guestMessage;
        document.getElementById('statsBack').addEventListener('click', loadDashboard);
        showPage(statsPage);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/scores/stats/${currentUser.id}`);
        const stats = await response.json();

        if (response.ok) {
            const statsHTML = `
                <div class="stats-container">
                    <h2>Your Statistics</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <h3>Total Questions</h3>
                            <p class="stat-value">${stats.total_questions || 0}</p>
                        </div>
                        <div class="stat-card">
                            <h3>Correct Answers</h3>
                            <p class="stat-value">${Math.round((stats.correct_answers || 0))}</p>
                        </div>
                        <div class="stat-card">
                            <h3>Accuracy</h3>
                            <p class="stat-value">${stats.total_questions > 0 ? ((stats.correct_answers / stats.total_questions) * 100).toFixed(1) : 0}%</p>
                        </div>
                        <div class="stat-card">
                            <h3>Total Score</h3>
                            <p class="stat-value">${stats.total_score || 0}</p>
                        </div>
                        <div class="stat-card">
                            <h3>Average Score</h3>
                            <p class="stat-value">${(stats.avg_score || 0).toFixed(2)}</p>
                        </div>
                        <div class="stat-card">
                            <h3>Total Time</h3>
                            <p class="stat-value">${stats.total_time ? formatTime(stats.total_time) : '0m 0s'}</p>
                        </div>
                    </div>
                    <button id="statsBack" class="action-btn">Back to Dashboard</button>
                </div>
            `;

            statsContent.innerHTML = statsHTML;
            document.getElementById('statsBack').addEventListener('click', loadDashboard);
            showPage(statsPage);
        } else {
            showAlert('Failed to load statistics', 'error');
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        showAlert('Connection error. Please try again.', 'error');
    }
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show alert message
 * @param {string} message - Message to display
 * @param {string} type - Type of alert ('success' or 'error')
 */
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        background-color: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#2ecc71' : '#3498db'};
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease-in-out;
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

/**
 * Check if user is already logged in (from localStorage)
 * If not, create a guest user and go directly to dashboard
 */
function checkUserLogin() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            userNameSpan.textContent = currentUser.username;
            loadDashboard();
        } catch (e) {
            console.error('Error restoring user session:', e);
            // Create guest user on error
            createGuestUser();
        }
    } else {
        // No saved user - create guest user and go directly to dashboard
        createGuestUser();
    }
}

/**
 * Create a guest user and load dashboard
 */
function createGuestUser() {
    // Generate a random guest ID (999000-999999)
    const guestId = 999000 + Math.floor(Math.random() * 1000);
    
    currentUser = {
        id: guestId,
        username: 'Guest Player',
        email: 'guest@mathquiz.local',
        isGuest: true
    };
    localStorage.setItem('user', JSON.stringify(currentUser));
    userNameSpan.textContent = currentUser.username;
    loadDashboard();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize application
document.addEventListener('DOMContentLoaded', checkUserLogin);