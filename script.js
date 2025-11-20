// Farm Expense Tracker - Main JavaScript
// State management
let currentUser = null;
let users = [];
let expenses = [];
let revenues = [];
let livestock = [];
let processing = [];
let logistics = [];
let budget = {
  total: 0,
  remaining: 0
};

// API Client
let apiClient = null;

// DOM elements
const pages = {
  landing: document.getElementById('landing-page'),
  login: document.getElementById('login-page'),
  signup: document.getElementById('signup-page'),
  dashboard: document.getElementById('dashboard-page'),
  livestock: document.getElementById('livestock-page'),
  processing: document.getElementById('processing-page'),
  logistics: document.getElementById('logistics-page'),
  settings: document.getElementById('settings-page')
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  // Initialize API client
  apiClient = new FarmAPIClient();

  loadCurrentUser();
  loadFromStorage();
  setupEventListeners();
  setupHistoryManagement();
  checkAuth();
  updateUI();
});

// Event listeners setup
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', handleNavigation);
  });

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Auth forms
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('signup-form').addEventListener('submit', handleSignup);

  // Expense form
  document.getElementById('expense-form').addEventListener('submit', handleExpenseSubmit);

  // Revenue form
  document.getElementById('revenue-form').addEventListener('submit', handleRevenueSubmit);

  // Livestock form
  document.getElementById('livestock-form').addEventListener('submit', handleLivestockSubmit);

  // Processing form
  document.getElementById('processing-form').addEventListener('submit', handleProcessingSubmit);

  // Logistics form
  document.getElementById('logistics-form').addEventListener('submit', handleLogisticsSubmit);

  // Budget settings
  document.getElementById('budget-form').addEventListener('submit', handleBudgetUpdate);

  // Settings
  document.getElementById('settings-form').addEventListener('submit', handleSettingsUpdate);

  // Logout
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  // Modal close
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => closeModal());
  });

  // Click outside modal
  document.getElementById('expense-modal').addEventListener('click', (e) => {
    if (e.target.id === 'expense-modal') closeModal('expense-modal');
  });

  document.getElementById('revenue-modal').addEventListener('click', (e) => {
    if (e.target.id === 'revenue-modal') closeModal('revenue-modal');
  });

  document.getElementById('livestock-modal').addEventListener('click', (e) => {
    if (e.target.id === 'livestock-modal') closeModal('livestock-modal');
  });

  document.getElementById('edit-modal').addEventListener('click', (e) => {
    if (e.target.id === 'edit-modal') closeModal('edit-modal');
  });

  document.getElementById('edit-revenue-modal').addEventListener('click', (e) => {
    if (e.target.id === 'edit-revenue-modal') closeModal('edit-revenue-modal');
  });

  document.getElementById('edit-livestock-modal').addEventListener('click', (e) => {
    if (e.target.id === 'edit-livestock-modal') closeModal('edit-livestock-modal');
  });

  document.getElementById('processing-modal').addEventListener('click', (e) => {
    if (e.target.id === 'processing-modal') closeModal('processing-modal');
  });

  document.getElementById('logistics-modal').addEventListener('click', (e) => {
    if (e.target.id === 'logistics-modal') closeModal('logistics-modal');
  });

  // Edit form submissions
  document.getElementById('edit-expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    updateExpense();
  });

  document.getElementById('edit-revenue-form').addEventListener('submit', (e) => {
    e.preventDefault();
    updateRevenue();
  });

  document.getElementById('edit-livestock-form').addEventListener('submit', (e) => {
    e.preventDefault();
    updateLivestock();
  });

  document.getElementById('edit-processing-form').addEventListener('submit', (e) => {
    e.preventDefault();
    updateProcessing();
  });

  document.getElementById('edit-logistics-form').addEventListener('submit', (e) => {
    e.preventDefault();
    updateLogistics();
  });

  // User dropdown
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userMenu = document.getElementById('user-menu');

  if (userMenuBtn && userMenu) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      userMenu.classList.remove('show');
    });

    document.getElementById('logout-link').addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }

  // Modal triggers
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modalId = e.target.closest('[data-modal]').dataset.modal;
      openModal(modalId);
    });
  });

  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('expense-date').value = today;
  document.getElementById('revenue-date').value = today;
  document.getElementById('livestock-purchase-date').value = today;
}

// Browser history management
function setupHistoryManagement() {
  // Handle browser back/forward buttons
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
      showPage(event.state.page, true); // From history navigation - don't push state again
    }
  });

  // Set initial state
  const currentPage = getCurrentPage();
  if (currentPage) {
    history.replaceState({ page: currentPage }, '', `#${currentPage}`);
  }
}

function getCurrentPage() {
  // Find which page is currently active
  for (const [pageName, pageElement] of Object.entries(pages)) {
    if (pageElement.classList.contains('active')) {
      return pageName;
    }
  }
  return null;
}

// Navigation
function handleNavigation(e) {
  const target = e.target.dataset.page;
  if (target) {
    showPage(target);
  }
}

function showPage(pageName, fromHistory = false) {
  // Hide all pages
  Object.values(pages).forEach(page => page.classList.remove('active'));

  // Show target page
  if (pages[pageName]) {
    pages[pageName].classList.add('active');
  }

  // Update navigation active state
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-page="${pageName}"]`)?.classList.add('active');

  // Push to history if not from history navigation
  if (!fromHistory) {
    history.pushState({ page: pageName }, '', `#${pageName}`);
  }
}

// Theme toggle
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // Update theme toggle icon
  const icon = document.querySelector('#theme-toggle i');
  icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Authentication
async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  try {
    // Try API login first
    const apiResult = await apiClient.login(email, password);
    if (apiResult.success) {
      currentUser = apiResult.user;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      // Load data from API
      await loadDataFromAPI();

      showPage('dashboard');
      updateUI();
      showNotification('Welcome back!', 'success');
      return;
    }
  } catch (apiError) {
    console.warn('API login failed, falling back to localStorage:', apiError.message);
  }

  // Fallback to localStorage
  const existingUser = users.find(user => user.email === email);
  if (!existingUser) {
    showNotification('Account not found. Please sign up first.', 'error');
    return;
  }

  // Simple password check (in real app, this would be hashed)
  if (existingUser.password !== password) {
    showNotification('Invalid password', 'error');
    return;
  }

  // Set current user
  currentUser = existingUser;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  // Load user-specific data
  loadUserData();

  showPage('dashboard');
  updateUI();
  showNotification('Welcome back!', 'success');
}

async function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const farmName = document.getElementById('signup-farm').value;
  const password = document.getElementById('signup-password').value;

  if (!name || !email || !farmName || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    showNotification('An account with this email already exists. Please log in instead.', 'error');
    return;
  }

  try {
    // API placeholder
    await apiRegister({ name, email, farmName, password });

    // Generate unique ID
    const userId = Date.now();

    // Create new user object
    const newUser = {
      id: userId,
      email: email,
      farmName: farmName,
      name: name,
      password: password // In a real app, this would be hashed
    };

    // Add user to users array
    users.push(newUser);

    // Set as current user
    currentUser = {
      id: userId,
      email: email,
      farmName: farmName,
      name: name
    };

    // Clear all previous data for new user
    expenses = [];
    revenues = [];
    livestock = [];
    budget = {
      total: 0,
      remaining: 0
    };

    // Save users array and current user to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    saveToStorage(); // Save empty data
    showPage('dashboard');
    updateUI();
    showNotification('Account created successfully!', 'success');
  } catch (error) {
    showNotification('Registration failed. Please try again.', 'error');
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  showPage('landing');
  updateUI();
  showNotification('Logged out successfully', 'success');
}

function checkAuth() {
  if (currentUser) {
    showPage('dashboard');
  } else {
    showPage('login');
  }
}

// Expense management
async function handleExpenseSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const expenseData = {
    id: Date.now(),
    category: formData.get('category'),
    amount: parseFloat(formData.get('amount')),
    date: formData.get('date'),
    description: formData.get('description'),
    timestamp: new Date().toISOString(),
    type: 'expense'
  };

  // Validation
  if (!expenseData.category || !expenseData.amount || !expenseData.date) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (expenseData.amount <= 0) {
    showNotification('Amount must be greater than 0', 'error');
    return;
  }

  try {
    // API placeholder
    await apiSaveExpense(expenseData);

    // Add to local state
    expenses.push(expenseData);
    saveToStorage();

    // Update budget
    updateBudget();

    // Reset form
    e.target.reset();
    document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];

    // Update UI
    updateUI();
    showNotification('Expense added successfully!', 'success');

    // Close modal
    closeModal('expense-modal');

    // ML prediction placeholder
    callFarmMLModel([...expenses, ...revenues]);

    // N8N automation placeholder
    sendToN8N({ type: 'expense_added', data: expenseData });

  } catch (error) {
    showNotification('Failed to save expense', 'error');
  }
}

// Revenue management
async function handleRevenueSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const revenueData = {
    id: Date.now(),
    category: formData.get('category'),
    amount: parseFloat(formData.get('amount')),
    date: formData.get('date'),
    description: formData.get('description'),
    timestamp: new Date().toISOString(),
    type: 'revenue'
  };

  // Validation
  if (!revenueData.category || !revenueData.amount || !revenueData.date) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (revenueData.amount <= 0) {
    showNotification('Amount must be greater than 0', 'error');
    return;
  }

  try {
    // API placeholder
    await apiSaveRevenue(revenueData);

    // Add to local state
    revenues.push(revenueData);
    saveToStorage();

    // Update budget
    updateBudget();

    // Reset form
    e.target.reset();
    document.getElementById('revenue-date').value = new Date().toISOString().split('T')[0];

    // Update UI
    updateUI();
    showNotification('Revenue added successfully!', 'success');

    // Close modal
    closeModal('revenue-modal');

    // ML prediction placeholder
    callFarmMLModel([...expenses, ...revenues]);

    // N8N automation placeholder
    sendToN8N({ type: 'revenue_added', data: revenueData });

  } catch (error) {
    showNotification('Failed to save revenue', 'error');
  }
}

// Livestock management
async function handleLivestockSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const livestockData = {
    id: Date.now(),
    type: formData.get('type'),
    breed: formData.get('breed'),
    quantity: parseInt(formData.get('quantity')),
    age: parseInt(formData.get('age')),
    weight: parseFloat(formData.get('weight')),
    purchaseDate: formData.get('purchase_date'),
    purchasePrice: parseFloat(formData.get('purchase_price')),
    notes: formData.get('notes'),
    timestamp: new Date().toISOString()
  };

  // Validation
  if (!livestockData.type || !livestockData.quantity || !livestockData.purchaseDate) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (livestockData.quantity <= 0) {
    showNotification('Quantity must be greater than 0', 'error');
    return;
  }

  try {
    // API placeholder
    await apiSaveLivestock(livestockData);

    // Add to local state
    livestock.push(livestockData);
    saveToStorage();

    // Reset form
    e.target.reset();
    document.getElementById('livestock-purchase-date').value = new Date().toISOString().split('T')[0];

    // Update UI
    updateUI();
    showNotification('Livestock added successfully!', 'success');

    // N8N automation placeholder
    sendToN8N({ type: 'livestock_added', data: livestockData });

  } catch (error) {
    showNotification('Failed to save livestock', 'error');
  }
}

// Processing management
async function handleProcessingSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const processingData = {
    id: Date.now(),
    type: formData.get('type'),
    product: formData.get('product'),
    quantity: parseFloat(formData.get('quantity')),
    processingDate: formData.get('date'),
    cost: parseFloat(formData.get('cost')),
    outputQuantity: parseFloat(formData.get('quantity')), // Default to input quantity if not specified
    notes: formData.get('description'),
    timestamp: new Date().toISOString()
  };

  // Validation
  if (!processingData.type || !processingData.product || !processingData.quantity || !processingData.processingDate) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (processingData.quantity <= 0) {
    showNotification('Quantity must be greater than 0', 'error');
    return;
  }

  try {
    // API placeholder
    await apiSaveProcessing(processingData);

    // Add to local state
    processing.push(processingData);
    saveToStorage();

    // Reset form
    e.target.reset();
    document.getElementById('processing-date').value = new Date().toISOString().split('T')[0];

    // Update UI
    updateUI();
    showNotification('Processing activity added successfully!', 'success');

    // N8N automation placeholder
    sendToN8N({ type: 'processing_added', data: processingData });

  } catch (error) {
    showNotification('Failed to save processing activity', 'error');
  }
}

// Logistics management
async function handleLogisticsSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const logisticsData = {
    id: Date.now(),
    type: formData.get('type'),
    destination: formData.get('destination'),
    quantity: parseInt(formData.get('quantity')),
    shippingDate: formData.get('shipping_date'),
    cost: parseFloat(formData.get('cost')),
    carrier: formData.get('carrier'),
    trackingNumber: formData.get('tracking_number'),
    notes: formData.get('notes'),
    timestamp: new Date().toISOString()
  };

  // Validation
  if (!logisticsData.type || !logisticsData.destination || !logisticsData.shippingDate) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (logisticsData.quantity && logisticsData.quantity <= 0) {
    showNotification('Quantity must be greater than 0', 'error');
    return;
  }

  try {
    // API placeholder
    await apiSaveLogistics(logisticsData);

    // Add to local state
    logistics.push(logisticsData);
    saveToStorage();

    // Reset form
    e.target.reset();
    document.getElementById('logistics-shipping-date').value = new Date().toISOString().split('T')[0];

    // Update UI
    updateUI();
    showNotification('Logistics activity added successfully!', 'success');

    // N8N automation placeholder
    sendToN8N({ type: 'logistics_added', data: logisticsData });

  } catch (error) {
    showNotification('Failed to save logistics activity', 'error');
  }
}

function editExpense(id) {
  const expense = expenses.find(e => e.id === id);
  if (!expense) return;

  // Populate edit modal
  document.getElementById('edit-id').value = expense.id;
  document.getElementById('edit-category').value = expense.category;
  document.getElementById('edit-amount').value = expense.amount;
  document.getElementById('edit-date').value = expense.date;
  document.getElementById('edit-description').value = expense.description;

  // Show modal
  document.getElementById('edit-modal').classList.add('show');
}

function editRevenue(id) {
  const revenue = revenues.find(r => r.id === id);
  if (!revenue) return;

  // Populate edit modal
  document.getElementById('edit-revenue-id').value = revenue.id;
  document.getElementById('edit-revenue-category').value = revenue.category;
  document.getElementById('edit-revenue-amount').value = revenue.amount;
  document.getElementById('edit-revenue-date').value = revenue.date;
  document.getElementById('edit-revenue-description').value = revenue.description;

  // Show modal
  document.getElementById('edit-revenue-modal').classList.add('show');
}

function editLivestock(id) {
  const animal = livestock.find(l => l.id === id);
  if (!animal) return;

  // Populate edit modal
  document.getElementById('edit-livestock-id').value = animal.id;
  document.getElementById('edit-livestock-type').value = animal.type;
  document.getElementById('edit-livestock-breed').value = animal.breed;
  document.getElementById('edit-livestock-quantity').value = animal.quantity;
  document.getElementById('edit-livestock-age').value = animal.age;
  document.getElementById('edit-livestock-weight').value = animal.weight;
  document.getElementById('edit-livestock-purchase-date').value = animal.purchaseDate;
  document.getElementById('edit-livestock-purchase-price').value = animal.purchasePrice;
  document.getElementById('edit-livestock-notes').value = animal.notes;

  // Show modal
  document.getElementById('edit-livestock-modal').classList.add('show');
}

function editProcessing(id) {
  const activity = processing.find(p => p.id === id);
  if (!activity) return;

  // Populate edit modal
  document.getElementById('edit-processing-id').value = activity.id;
  document.getElementById('edit-processing-type').value = activity.type;
  document.getElementById('edit-processing-product').value = activity.product;
  document.getElementById('edit-processing-quantity').value = activity.quantity;
  document.getElementById('edit-processing-date').value = activity.processingDate;
  document.getElementById('edit-processing-cost').value = activity.cost;
  document.getElementById('edit-processing-output-quantity').value = activity.outputQuantity;
  document.getElementById('edit-processing-description').value = activity.notes;

  // Show modal
  document.getElementById('edit-processing-modal').classList.add('show');
}

function editLogistics(id) {
  const activity = logistics.find(l => l.id === id);
  if (!activity) return;

  // Populate edit modal
  document.getElementById('edit-logistics-id').value = activity.id;
  document.getElementById('edit-logistics-type').value = activity.type;
  document.getElementById('edit-logistics-destination').value = activity.destination;
  document.getElementById('edit-logistics-quantity').value = activity.quantity;
  document.getElementById('edit-logistics-shipping-date').value = activity.shippingDate;
  document.getElementById('edit-logistics-cost').value = activity.cost;
  document.getElementById('edit-logistics-carrier').value = activity.carrier;
  document.getElementById('edit-logistics-tracking-number').value = activity.trackingNumber;
  document.getElementById('edit-logistics-notes').value = activity.notes;

  // Show modal
  document.getElementById('edit-logistics-modal').classList.add('show');
}

function updateExpense() {
  const id = parseInt(document.getElementById('edit-id').value);
  const category = document.getElementById('edit-category').value;
  const amount = parseFloat(document.getElementById('edit-amount').value);
  const date = document.getElementById('edit-date').value;
  const description = document.getElementById('edit-description').value;

  if (!category || !amount || !date) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (amount <= 0) {
    showNotification('Amount must be greater than 0', 'error');
    return;
  }

  const index = expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], category, amount, date, description };
    saveToStorage();
    updateBudget();
    updateUI();
    closeModal();
    showNotification('Expense updated successfully!', 'success');
  }
}

function updateRevenue() {
  const id = parseInt(document.getElementById('edit-revenue-id').value);
  const category = document.getElementById('edit-revenue-category').value;
  const amount = parseFloat(document.getElementById('edit-revenue-amount').value);
  const date = document.getElementById('edit-revenue-date').value;
  const description = document.getElementById('edit-revenue-description').value;

  if (!category || !amount || !date) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (amount <= 0) {
    showNotification('Amount must be greater than 0', 'error');
    return;
  }

  const index = revenues.findIndex(r => r.id === id);
  if (index !== -1) {
    revenues[index] = { ...revenues[index], category, amount, date, description };
    saveToStorage();
    updateBudget();
    updateUI();
    closeModal();
    showNotification('Revenue updated successfully!', 'success');
  }
}

function updateLivestock() {
  const id = parseInt(document.getElementById('edit-livestock-id').value);
  const type = document.getElementById('edit-livestock-type').value;
  const breed = document.getElementById('edit-livestock-breed').value;
  const quantity = parseInt(document.getElementById('edit-livestock-quantity').value);
  const age = parseInt(document.getElementById('edit-livestock-age').value);
  const weight = parseFloat(document.getElementById('edit-livestock-weight').value);
  const purchaseDate = document.getElementById('edit-livestock-purchase-date').value;
  const purchasePrice = parseFloat(document.getElementById('edit-livestock-purchase-price').value);
  const notes = document.getElementById('edit-livestock-notes').value;

  if (!type || !quantity || !purchaseDate) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (quantity <= 0) {
    showNotification('Quantity must be greater than 0', 'error');
    return;
  }

  const index = livestock.findIndex(l => l.id === id);
  if (index !== -1) {
    livestock[index] = { ...livestock[index], type, breed, quantity, age, weight, purchaseDate, purchasePrice, notes };
    saveToStorage();
    updateUI();
    closeModal();
    showNotification('Livestock updated successfully!', 'success');
  }
}

function updateProcessing() {
  const id = parseInt(document.getElementById('edit-processing-id').value);
  const type = document.getElementById('edit-processing-type').value;
  const quantity = parseInt(document.getElementById('edit-processing-quantity').value);
  const processingDate = document.getElementById('edit-processing-date').value;
  const cost = parseFloat(document.getElementById('edit-processing-cost').value);
  const outputQuantity = parseInt(document.getElementById('edit-processing-output-quantity').value);
  const notes = document.getElementById('edit-processing-notes').value;

  if (!type || !quantity || !processingDate) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (quantity <= 0) {
    showNotification('Quantity must be greater than 0', 'error');
    return;
  }

  const index = processing.findIndex(p => p.id === id);
  if (index !== -1) {
    processing[index] = { ...processing[index], type, quantity, processingDate, cost, outputQuantity, notes };
    saveToStorage();
    updateUI();
    closeModal();
    showNotification('Processing activity updated successfully!', 'success');
  }
}

function updateLogistics() {
  const id = parseInt(document.getElementById('edit-logistics-id').value);
  const type = document.getElementById('edit-logistics-type').value;
  const destination = document.getElementById('edit-logistics-destination').value;
  const quantity = parseInt(document.getElementById('edit-logistics-quantity').value);
  const shippingDate = document.getElementById('edit-logistics-shipping-date').value;
  const cost = parseFloat(document.getElementById('edit-logistics-cost').value);
  const carrier = document.getElementById('edit-logistics-carrier').value;
  const trackingNumber = document.getElementById('edit-logistics-tracking-number').value;
  const notes = document.getElementById('edit-logistics-notes').value;

  if (!type || !destination || !shippingDate) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }

  if (quantity && quantity <= 0) {
    showNotification('Quantity must be greater than 0', 'error');
    return;
  }

  const index = logistics.findIndex(l => l.id === id);
  if (index !== -1) {
    logistics[index] = { ...logistics[index], type, destination, quantity, shippingDate, cost, carrier, trackingNumber, notes };
    saveToStorage();
    updateUI();
    closeModal();
    showNotification('Logistics activity updated successfully!', 'success');
  }
}

function deleteExpense(id) {
  if (confirm('Are you sure you want to delete this expense?')) {
    expenses = expenses.filter(e => e.id !== id);
    saveToStorage();
    updateBudget();
    updateUI();
    showNotification('Expense deleted successfully!', 'success');
  }
}

function deleteRevenue(id) {
  if (confirm('Are you sure you want to delete this revenue?')) {
    revenues = revenues.filter(r => r.id !== id);
    saveToStorage();
    updateBudget();
    updateUI();
    showNotification('Revenue deleted successfully!', 'success');
  }
}

function deleteLivestock(id) {
  if (confirm('Are you sure you want to delete this livestock entry?')) {
    livestock = livestock.filter(l => l.id !== id);
    saveToStorage();
    updateUI();
    showNotification('Livestock deleted successfully!', 'success');
  }
}

function deleteProcessing(id) {
  if (confirm('Are you sure you want to delete this processing activity?')) {
    processing = processing.filter(p => p.id !== id);
    saveToStorage();
    updateUI();
    showNotification('Processing activity deleted successfully!', 'success');
  }
}

function deleteLogistics(id) {
  if (confirm('Are you sure you want to delete this logistics activity?')) {
    logistics = logistics.filter(l => l.id !== id);
    saveToStorage();
    updateUI();
    showNotification('Logistics activity deleted successfully!', 'success');
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

function closeModal(modalId) {
  if (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }
  } else {
    // Close all modals
    document.getElementById('expense-modal').classList.remove('show');
    document.getElementById('revenue-modal').classList.remove('show');
    document.getElementById('livestock-modal').classList.remove('show');
    document.getElementById('edit-modal').classList.remove('show');
    document.getElementById('edit-revenue-modal').classList.remove('show');
    document.getElementById('edit-livestock-modal').classList.remove('show');
    document.getElementById('edit-processing-modal').classList.remove('show');
    document.getElementById('edit-logistics-modal').classList.remove('show');
  }
}

// Budget management
function handleBudgetUpdate(e) {
  e.preventDefault();

  const totalBudget = parseFloat(document.getElementById('total-budget').value);

  if (!totalBudget || totalBudget <= 0) {
    showNotification('Please enter a valid budget amount', 'error');
    return;
  }

  budget.total = totalBudget;
  updateBudget();
  saveToStorage();
  updateUI();
  showNotification('Budget updated successfully!', 'success');
}

function updateBudget() {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRevenues = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
  budget.remaining = budget.total - totalExpenses + totalRevenues;
}

// Settings
function handleSettingsUpdate(e) {
  e.preventDefault();

  const name = document.getElementById('settings-name').value;
  const farmName = document.getElementById('settings-farm').value;
  const email = document.getElementById('settings-email').value;

  if (!name || !farmName || !email) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  currentUser.name = name;
  currentUser.farmName = farmName;
  currentUser.email = email;

  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  updateUI();
  showNotification('Settings updated successfully!', 'success');
}

// UI updates
function updateUI() {
  if (currentUser) {
    // Update header
    document.getElementById('user-greeting').textContent = `Welcome, ${currentUser.name}`;
    document.getElementById('farm-name').textContent = currentUser.farmName;

    // Update settings form
    document.getElementById('settings-name').value = currentUser.name;
    document.getElementById('settings-farm').value = currentUser.farmName;
    document.getElementById('settings-email').value = currentUser.email;

    // Update budget form
    document.getElementById('total-budget').value = budget.total;

    // Update stats
    updateStats();

    // Update transactions table
    updateTransactionsTable();

    // Update livestock table
    updateLivestockTable();

    // Update processing table
    updateProcessingTable();

    // Update logistics table
    updateLogisticsTable();

    // Update charts
    updateCharts();
  }

  // Update navigation visibility
  updateNavigation();
}

function updateNavigation() {
  const nav = document.querySelector('.nav');
  const authNav = document.getElementById('auth-nav');
  const userNav = document.getElementById('user-nav');

  if (currentUser) {
    authNav.style.display = 'none';
    userNav.style.display = 'flex';
  } else {
    authNav.style.display = 'flex';
    userNav.style.display = 'none';
  }
}

function updateStats() {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRevenues = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
  const monthlyExpenses = getMonthlyExpenses();
  const profitLoss = totalRevenues - totalExpenses;
  const totalLivestockHeads = livestock.reduce((sum, animal) => sum + animal.quantity, 0);
  const costPerHead = totalLivestockHeads > 0 ? totalExpenses / totalLivestockHeads : 0;

  document.getElementById('total-budget-stat').textContent = `$${budget.total.toLocaleString()}`;
  document.getElementById('used-budget-stat').textContent = `$${totalExpenses.toLocaleString()}`;
  document.getElementById('remaining-budget-stat').textContent = `$${budget.remaining.toLocaleString()}`;
  document.getElementById('monthly-expenses-stat').textContent = `$${monthlyExpenses.toLocaleString()}`;
  document.getElementById('net-margin-stat').textContent = `${profitLoss >= 0 ? '+' : ''}$${profitLoss.toLocaleString()}`;
  document.getElementById('cost-per-head-stat').textContent = `$${costPerHead.toFixed(2)}`;
}

function getMonthlyExpenses() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
}

function getMonthlyRevenues() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return revenues
    .filter(revenue => {
      const revenueDate = new Date(revenue.date);
      return revenueDate.getMonth() === currentMonth && revenueDate.getFullYear() === currentYear;
    })
    .reduce((sum, revenue) => sum + revenue.amount, 0);
}

function updateTransactionsTable() {
  const tbody = document.querySelector('.expenses-table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  // Combine expenses and revenues
  const allTransactions = [
    ...expenses.map(e => ({ ...e, type: 'expense' })),
    ...revenues.map(r => ({ ...r, type: 'revenue' }))
  ];

  // Sort by date (newest first)
  const sortedTransactions = allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedTransactions.forEach(transaction => {
    const row = document.createElement('tr');

    const date = new Date(transaction.date).toLocaleDateString();
    const amount = Math.abs(transaction.amount).toLocaleString();
    const amountClass = transaction.type === 'revenue' ? 'positive' : 'negative';
    const amountPrefix = transaction.type === 'revenue' ? '+' : '-';

    row.innerHTML = `
      <td>${date}</td>
      <td>${transaction.category}</td>
      <td class="amount-cell ${amountClass}">${amountPrefix}$${amount}</td>
      <td>${transaction.description || '-'}</td>
      <td>
        <button class="action-btn" onclick="edit${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}(${transaction.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn" onclick="delete${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}(${transaction.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function updateLivestockTable() {
  const tbody = document.querySelector('.livestock-table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  // Sort by purchase date (newest first)
  const sortedLivestock = [...livestock].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

  sortedLivestock.forEach(animal => {
    const row = document.createElement('tr');

    const purchaseDate = new Date(animal.purchaseDate).toLocaleDateString();
    const totalValue = (animal.purchasePrice * animal.quantity).toLocaleString();

    row.innerHTML = `
      <td>${animal.type}</td>
      <td>${animal.breed || '-'}</td>
      <td>${animal.quantity}</td>
      <td>${animal.age || '-'} months</td>
      <td>${animal.weight || '-'} kg</td>
      <td>${purchaseDate}</td>
      <td>$${animal.purchasePrice.toLocaleString()}</td>
      <td>$${totalValue}</td>
      <td>
        <button class="action-btn" onclick="editLivestock(${animal.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn" onclick="deleteLivestock(${animal.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function updateProcessingTable() {
  const tbody = document.querySelector('.processing-table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  // Sort by processing date (newest first)
  const sortedProcessing = [...processing].sort((a, b) => new Date(b.processingDate) - new Date(a.processingDate));

  sortedProcessing.forEach(activity => {
    const row = document.createElement('tr');

    const processingDate = new Date(activity.processingDate).toLocaleDateString();
    const cost = activity.cost.toLocaleString();
    const outputQuantity = activity.outputQuantity || activity.quantity;

    row.innerHTML = `
      <td>${activity.type}</td>
      <td>${activity.product}</td>
      <td>${activity.quantity}</td>
      <td>${processingDate}</td>
      <td>$${cost}</td>
      <td>${outputQuantity}</td>
      <td>${activity.notes || '-'}</td>
      <td>
        <button class="action-btn" onclick="editProcessing(${activity.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn" onclick="deleteProcessing(${activity.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function updateLogisticsTable() {
  const tbody = document.querySelector('.logistics-table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  // Sort by shipping date (newest first)
  const sortedLogistics = [...logistics].sort((a, b) => new Date(b.shippingDate) - new Date(a.shippingDate));

  sortedLogistics.forEach(activity => {
    const row = document.createElement('tr');

    const shippingDate = new Date(activity.shippingDate).toLocaleDateString();
    const cost = activity.cost.toLocaleString();

    row.innerHTML = `
      <td>${activity.type}</td>
      <td>${activity.destination}</td>
      <td>${activity.quantity || '-'}</td>
      <td>${shippingDate}</td>
      <td>$${cost}</td>
      <td>${activity.carrier || '-'}</td>
      <td>${activity.trackingNumber || '-'}</td>
      <td>${activity.notes || '-'}</td>
      <td>
        <button class="action-btn" onclick="editLogistics(${activity.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn" onclick="deleteLogistics(${activity.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function updateCharts() {
  // Expense over time chart
  updateExpenseChart();

  // Category breakdown chart
  updateCategoryChart();

  // Revenue vs Expense chart
  updateRevenueExpenseChart();
}

function updateExpenseChart() {
  const ctx = document.getElementById('expense-chart');
  if (!ctx) return;

  // Group expenses by month
  const monthlyData = {};
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[key] = (monthlyData[key] || 0) + expense.amount;
  });

  const labels = Object.keys(monthlyData).sort();
  const data = labels.map(label => monthlyData[label]);

  if (window.expenseChart) {
    window.expenseChart.destroy();
  }

  window.expenseChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Monthly Expenses',
        data: data,
        borderColor: 'var(--error)',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

function updateCategoryChart() {
  const ctx = document.getElementById('category-chart');
  if (!ctx) return;

  // Group expenses by category
  const categoryData = {};
  expenses.forEach(expense => {
    categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
  });

  const labels = Object.keys(categoryData);
  const data = Object.values(categoryData);

  if (window.categoryChart) {
    window.categoryChart.destroy();
  }

  window.categoryChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
          '#4BC0C0',
          '#FF6384'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const category = labels[index];
          const amount = data[index];
          showNotification(`Category: ${category}, Total: $${amount.toLocaleString()}`, 'info');
        }
      }
    }
  });
}

function updateRevenueExpenseChart() {
  const ctx = document.getElementById('revenue-expense-chart');
  if (!ctx) return;

  // Group revenues and expenses by month
  const monthlyRevenue = {};
  const monthlyExpense = {};

  revenues.forEach(revenue => {
    const date = new Date(revenue.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyRevenue[key] = (monthlyRevenue[key] || 0) + revenue.amount;
  });

  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyExpense[key] = (monthlyExpense[key] || 0) + expense.amount;
  });

  const allKeys = new Set([...Object.keys(monthlyRevenue), ...Object.keys(monthlyExpense)]);
  const labels = Array.from(allKeys).sort();
  const revenueData = labels.map(label => monthlyRevenue[label] || 0);
  const expenseData = labels.map(label => monthlyExpense[label] || 0);

  if (window.revenueExpenseChart) {
    window.revenueExpenseChart.destroy();
  }

  window.revenueExpenseChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Revenue',
        data: revenueData,
        backgroundColor: 'var(--success)',
        borderColor: 'var(--success)',
        borderWidth: 1
      }, {
        label: 'Expenses',
        data: expenseData,
        backgroundColor: 'var(--error)',
        borderColor: 'var(--error)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// Storage
function saveToStorage() {
  if (currentUser) {
    localStorage.setItem(`expenses_${currentUser.id}`, JSON.stringify(expenses));
    localStorage.setItem(`revenues_${currentUser.id}`, JSON.stringify(revenues));
    localStorage.setItem(`livestock_${currentUser.id}`, JSON.stringify(livestock));
    localStorage.setItem(`processing_${currentUser.id}`, JSON.stringify(processing));
    localStorage.setItem(`logistics_${currentUser.id}`, JSON.stringify(logistics));
    localStorage.setItem(`budget_${currentUser.id}`, JSON.stringify(budget));
  }
}

function loadUserData() {
  if (currentUser) {
    const savedExpenses = localStorage.getItem(`expenses_${currentUser.id}`);
    const savedRevenues = localStorage.getItem(`revenues_${currentUser.id}`);
    const savedLivestock = localStorage.getItem(`livestock_${currentUser.id}`);
    const savedProcessing = localStorage.getItem(`processing_${currentUser.id}`);
    const savedLogistics = localStorage.getItem(`logistics_${currentUser.id}`);
    const savedBudget = localStorage.getItem(`budget_${currentUser.id}`);

    if (savedExpenses) {
      expenses = JSON.parse(savedExpenses);
    } else {
      expenses = [];
    }

    if (savedRevenues) {
      revenues = JSON.parse(savedRevenues);
    } else {
      revenues = [];
    }

    if (savedLivestock) {
      livestock = JSON.parse(savedLivestock);
    } else {
      livestock = [];
    }

    if (savedProcessing) {
      processing = JSON.parse(savedProcessing);
    } else {
      processing = [];
    }

    if (savedLogistics) {
      logistics = JSON.parse(savedLogistics);
    } else {
      logistics = [
        {
          id: 1,
          type: 'transportation',
          destination: 'Local Market',
          quantity: 100,
          shippingDate: '2024-01-15',
          cost: 250,
          carrier: 'Local Truck',
          trackingNumber: 'LT123456',
          notes: 'Delivered fresh produce',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          type: 'shipping',
          destination: 'Regional Distributor',
          quantity: 200,
          shippingDate: '2024-01-20',
          cost: 450,
          carrier: 'FedEx',
          trackingNumber: 'FX789012',
          notes: 'Express delivery for dairy products',
          timestamp: new Date().toISOString()
        },
        {
          id: 3,
          type: 'storage',
          destination: 'Cold Storage Facility',
          quantity: 50,
          shippingDate: '2024-01-10',
          cost: 150,
          carrier: 'N/A',
          trackingNumber: 'CS345678',
          notes: 'Monthly storage fee',
          timestamp: new Date().toISOString()
        }
      ];
    }

    if (savedBudget) {
      budget = JSON.parse(savedBudget);
    } else {
      budget = {
        total: 0,
        remaining: 0
      };
    }
  }
}

function loadCurrentUser() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }
}

function loadFromStorage() {
  const savedTheme = localStorage.getItem('theme');
  const savedUsers = localStorage.getItem('users');

  if (savedUsers) {
    users = JSON.parse(savedUsers);
  }

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.querySelector('#theme-toggle i');
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  } else {
    // Default to light theme
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

async function loadDataFromAPI() {
  try {
    // Load data from API
    const [expensesResult, revenuesResult, livestockResult, budgetResult] = await Promise.all([
      apiClient.getExpenses(),
      apiClient.getRevenues(),
      apiClient.getLivestock(),
      apiClient.getBudget()
    ]);

    expenses = expensesResult.expenses || [];
    revenues = revenuesResult.revenues || [];
    livestock = livestockResult.livestock || [];
    budget = budgetResult.budget || { total: 0, remaining: 0 };

    // Save to localStorage as backup
    saveToStorage();
  } catch (error) {
    console.warn('Failed to load data from API, falling back to localStorage:', error.message);
    // Fallback to localStorage
    loadUserData();
  }
}

// Notifications
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  const container = document.getElementById('notification-container');
  if (container) {
    container.appendChild(notification);
  } else {
    document.body.appendChild(notification);
  }

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// API placeholders
async function apiLogin(credentials) {
  console.log('API: Logging in with', credentials);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}

async function apiRegister(userData) {
  console.log('API: Registering user with', userData);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
}

async function apiFetchExpenses() {
  console.log('API: Fetching expenses');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return expenses;
}

async function apiSaveExpense(expenseData) {
  console.log('API: Saving expense', expenseData);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

async function apiSaveRevenue(revenueData) {
  console.log('API: Saving revenue', revenueData);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

async function apiSaveLivestock(livestockData) {
  console.log('API: Saving livestock', livestockData);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

async function apiDeleteExpense(expenseId) {
  console.log('API: Deleting expense', expenseId);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

// ML placeholder
async function callFarmMLModel(data) {
  console.log('ML: Analyzing farm financial data for predictions', data);
  // Simulate ML processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('ML: Prediction complete - suggesting optimization strategies');
}

// N8N automation integration (FINAL PRODUCTION VERSION)
async function sendToN8N(eventData) {
  try {
    const payload = {
      type: eventData.type.replace('_added', ''), // normalize type
      email: currentUser?.email || "farm@tracker.app",
      data: eventData.data,
    };

    console.log("Sending to N8N webhook:", payload);

    const response = await fetch('https://expense.app.n8n.cloud/webhook/expense', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json().catch(() => ({}));
      console.log("✅ N8N response:", result);
      showNotification(result.message || "✅ Synced successfully with Farm Cloud Automation!", "success");
    } else {
      console.error("❌ N8N Error:", response.status, response.statusText);
      showNotification("⚠️ Failed to sync with cloud automation", "error");
    }
  } catch (error) {
    console.error("🚫 N8N Connection Error:", error);
    showNotification("Network error — could not reach N8N server.", "error");
  }
}


// Export data to CSV
function exportCSV() {
  // Combine all data
  const allData = [
    ...expenses.map(e => ({ ...e, dataType: 'Expense' })),
    ...revenues.map(r => ({ ...r, dataType: 'Revenue' })),
    ...livestock.map(l => ({ ...l, dataType: 'Livestock' }))
  ];

  if (allData.length === 0) {
    showNotification('No data to export', 'error');
    return;
  }

  // Create CSV headers
  const headers = [
    'Type', 'Category', 'Amount', 'Date', 'Description',
    'Livestock Type', 'Breed', 'Quantity', 'Age', 'Weight', 'Purchase Price', 'Notes'
  ];

  // Create CSV rows
  const rows = allData.map(item => [
    item.dataType,
    item.category || item.type || '',
    item.amount || (item.purchasePrice ? item.purchasePrice * item.quantity : ''),
    item.date || item.purchaseDate || '',
    item.description || item.notes || '',
    item.type || '',
    item.breed || '',
    item.quantity || '',
    item.age || '',
    item.weight || '',
    item.purchasePrice || '',
    item.notes || ''
  ]);

  // Convert to CSV string
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `farm-expenses-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification('Data exported successfully!', 'success');
}

// Sync data (placeholder for cloud sync)
async function syncData() {
  try {
    showNotification('Syncing data...', 'info');

    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, this would sync with a server
    // For now, just save to localStorage again
    saveToStorage();

    showNotification('Data synced successfully!', 'success');
  } catch (error) {
    showNotification('Sync failed. Please try again.', 'error');
  }
}

// AI prediction function
async function predictExpense() {
  if (expenses.length === 0) {
    showNotification('Need at least some expense data for predictions', 'error');
    return;
  }

  try {
    showNotification('Analyzing data for predictions...', 'info');

    // Call ML model
    await callFarmMLModel([...expenses, ...revenues]);

    // Simulate prediction results
    const nextMonthPrediction = getMonthlyExpenses() * 1.1; // Simple 10% increase prediction
    const topCategory = getTopExpenseCategory();

    // Update prediction display
    document.getElementById('predicted-expenses').textContent = `$${nextMonthPrediction.toLocaleString()}`;
    document.getElementById('overspend-risk').textContent = topCategory;

    showNotification('Predictions updated!', 'success');
  } catch (error) {
    showNotification('Prediction failed. Please try again.', 'error');
  }
}

// Helper function to get top expense category
function getTopExpenseCategory() {
  const categoryTotals = {};
  expenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const topCategory = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)[0];

  return topCategory ? topCategory[0] : 'None';
}
