// Dashboard JavaScript
let currentUser = null;
let accounts = [];
let posts = [];

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(user);
    document.getElementById('userName').textContent = `Welcome, ${currentUser.full_name || currentUser.username}`;
    
    // Initialize dashboard
    await loadDashboardData();
    setupEventListeners();
    showPage('overview');
});

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Modal handlers
    document.getElementById('addAccountBtn').addEventListener('click', () => {
        document.getElementById('accountModal').style.display = 'block';
    });
    
    document.getElementById('addPostBtn').addEventListener('click', () => {
        populateAccountSelect();
        document.getElementById('postModal').style.display = 'block';
    });
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
    
    // Form submissions
    document.getElementById('accountForm').addEventListener('submit', handleAddAccount);
    document.getElementById('postForm').addEventListener('submit', handleAddPost);
    document.getElementById('profileForm').addEventListener('submit', handleUpdateProfile);
}

// Show specific page
function showPage(pageName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
    
    // Update page title
    const titles = {
        overview: 'Dashboard Overview',
        accounts: 'Social Media Accounts',
        posts: 'Posts Management',
        analytics: 'Analytics',
        profile: 'Profile Settings'
    };
    document.getElementById('pageTitle').textContent = titles[pageName];
    
    // Show/hide pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageName).classList.add('active');
    
    // Load page-specific data
    switch(pageName) {
        case 'overview':
            loadOverviewData();
            break;
        case 'accounts':
            loadAccountsData();
            break;
        case 'posts':
            loadPostsData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'profile':
            loadProfileData();
            break;
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const [statsData, accountsData, postsData] = await Promise.all([
            apiCall('/dashboard/stats'),
            apiCall('/accounts'),
            apiCall('/posts')
        ]);
        
        accounts = accountsData;
        posts = postsData;
        
        // Update stats
        document.getElementById('totalAccounts').textContent = statsData.total_accounts || 0;
        document.getElementById('totalPosts').textContent = statsData.total_posts || 0;
        document.getElementById('totalFollowers').textContent = (statsData.total_followers || 0).toLocaleString();
        document.getElementById('totalLikes').textContent = (statsData.total_likes || 0).toLocaleString();
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

// Load overview data
async function loadOverviewData() {
    const recentPostsContainer = document.getElementById('recentPosts');
    const recentPosts = posts.slice(0, 5);
    
    if (recentPosts.length === 0) {
        recentPostsContainer.innerHTML = '<p>No posts yet. Create your first post!</p>';
        return;
    }
    
    recentPostsContainer.innerHTML = recentPosts.map(post => `
        <div class="post-item">
            <h4>${post.title}</h4>
            <div class="post-meta">${post.platform} • ${post.account_name} • ${new Date(post.created_at).toLocaleDateString()}</div>
            <p>${post.content || 'No content'}</p>
            <div class="post-stats">
                <span>❤️ ${post.likes}</span>
                <span>💬 ${post.comments}</span>
                <span>🔄 ${post.shares}</span>
            </div>
        </div>
    `).join('');
}

// Load accounts data
async function loadAccountsData() {
    const tbody = document.querySelector('#accountsTable tbody');
    
    if (accounts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No accounts added yet.</td></tr>';
        return;
    }
    
    tbody.innerHTML = accounts.map(account => `
        <tr>
            <td>${account.platform}</td>
            <td>${account.account_name}</td>
            <td>${account.followers.toLocaleString()}</td>
            <td>${account.following.toLocaleString()}</td>
            <td>${account.posts_count}</td>
            <td><span class="status-${account.status}">${account.status}</span></td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteAccount(${account.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Load posts data
async function loadPostsData() {
    const tbody = document.querySelector('#postsTable tbody');
    
    if (posts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">No posts created yet.</td></tr>';
        return;
    }
    
    tbody.innerHTML = posts.map(post => `
        <tr>
            <td>${post.title}</td>
            <td>${post.platform}</td>
            <td>${post.account_name}</td>
            <td>${post.likes}</td>
            <td>${post.comments}</td>
            <td>${post.shares}</td>
            <td>${new Date(post.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deletePost(${post.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Load analytics data
async function loadAnalyticsData() {
    try {
        const [engagementData, growthData] = await Promise.all([
            apiCall('/analytics/engagement'),
            apiCall('/analytics/growth')
        ]);
        
        // Engagement Chart
        const engagementCtx = document.getElementById('engagementChart').getContext('2d');
        new Chart(engagementCtx, {
            type: 'bar',
            data: {
                labels: engagementData.map(d => d.platform),
                datasets: [
                    {
                        label: 'Likes',
                        data: engagementData.map(d => d.likes),
                        backgroundColor: 'rgba(255, 99, 132, 0.8)'
                    },
                    {
                        label: 'Comments',
                        data: engagementData.map(d => d.comments),
                        backgroundColor: 'rgba(54, 162, 235, 0.8)'
                    },
                    {
                        label: 'Shares',
                        data: engagementData.map(d => d.shares),
                        backgroundColor: 'rgba(255, 205, 86, 0.8)'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Followers Chart
        const followersCtx = document.getElementById('followersChart').getContext('2d');
        new Chart(followersCtx, {
            type: 'doughnut',
            data: {
                labels: growthData.map(d => d.platform),
                datasets: [{
                    data: growthData.map(d => d.followers),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });
        
    } catch (error) {
        console.error('Failed to load analytics data:', error);
    }
}

// Load profile data
function loadProfileData() {
    document.getElementById('profileUsername').value = currentUser.username;
    document.getElementById('profileFullName').value = currentUser.full_name || '';
    document.getElementById('profileEmail').value = currentUser.email;
}

// Handle add account
async function handleAddAccount(e) {
    e.preventDefault();
    
    const formData = {
        platform: document.getElementById('platform').value,
        account_name: document.getElementById('accountName').value,
        followers: parseInt(document.getElementById('followers').value) || 0,
        following: parseInt(document.getElementById('following').value) || 0
    };
    
    try {
        await apiCall('/accounts', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        document.getElementById('accountModal').style.display = 'none';
        document.getElementById('accountForm').reset();
        await loadDashboardData();
        loadAccountsData();
        
    } catch (error) {
        alert('Failed to add account');
    }
}

// Handle add post
async function handleAddPost(e) {
    e.preventDefault();
    
    const accountId = document.getElementById('postAccount').value;
    const selectedAccount = accounts.find(acc => acc.id == accountId);
    
    const formData = {
        account_id: accountId,
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        platform: selectedAccount.platform
    };
    
    try {
        await apiCall('/posts', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        document.getElementById('postModal').style.display = 'none';
        document.getElementById('postForm').reset();
        await loadDashboardData();
        loadPostsData();
        
    } catch (error) {
        alert('Failed to create post');
    }
}

// Handle update profile
async function handleUpdateProfile(e) {
    e.preventDefault();
    alert('Profile update functionality would be implemented here');
}

// Delete account
async function deleteAccount(accountId) {
    if (!confirm('Are you sure you want to delete this account?')) return;
    
    try {
        await apiCall(`/accounts/${accountId}`, { method: 'DELETE' });
        await loadDashboardData();
        loadAccountsData();
    } catch (error) {
        alert('Failed to delete account');
    }
}

// Delete post
async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
        await apiCall(`/posts/${postId}`, { method: 'DELETE' });
        await loadDashboardData();
        loadPostsData();
    } catch (error) {
        alert('Failed to delete post');
    }
}

// Populate account select dropdown
function populateAccountSelect() {
    const select = document.getElementById('postAccount');
    select.innerHTML = '<option value="">Select Account</option>';
    
    accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = `${account.platform} - ${account.account_name}`;
        select.appendChild(option);
    });
}