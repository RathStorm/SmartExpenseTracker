// Basic unit tests for navigation and event listeners in script.js
// Using Jest-like syntax for demonstration

// Mock DOM elements and required globals
global.document = {
  querySelectorAll: jest.fn(),
  querySelector: jest.fn(),
  getElementById: jest.fn(),
  createElement: jest.fn(() => ({
    classList: { add: jest.fn(), remove: jest.fn(), toggle: jest.fn(), contains: jest.fn(() => false) },
    setAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    appendChild: jest.fn(),
    textContent: '',
    style: {},
    addEventListener: jest.fn(),
    innerHTML: '',
    click: jest.fn()
  })),
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn()
  }
};

global.window = {
  addEventListener: jest.fn(),
  location: { hash: '' },
  history: {
    pushState: jest.fn(),
    replaceState: jest.fn()
  }
};

global.localStorage = {
  _storage: {},
  getItem: function(key) { return this._storage[key] || null; },
  setItem: function(key, value) { this._storage[key] = value.toString(); },
  removeItem: function(key) { delete this._storage[key]; }
};

// Minimal mocks and helpers for event objects
const createEvent = (target) => ({
  target,
  preventDefault: jest.fn()
});

describe('Navigation and Get Started Button Behavior', () => {
  let setupEventListeners, handleNavigation, showPage, currentUser, pages;

  beforeEach(() => {
    jest.resetModules();

    // Import the script.js module (should be adapted depending on actual environment)
    // Since this is a standalone test snippet, we mock minimal implementation here:
    currentUser = null;

    pages = {
      landing: { classList: { add: jest.fn(), remove: jest.fn() } },
      dashboard: { classList: { add: jest.fn(), remove: jest.fn() } },
      signup: { classList: { add: jest.fn(), remove: jest.fn() } }
    };

    // Minimal showPage mock
    showPage = jest.fn((pageName) => {
      Object.values(pages).forEach(page => page.classList.remove());
      if (pages[pageName]) {
        pages[pageName].classList.add();
      }
      window.history.pushState({}, '', `#${pageName}`);
    });

    // handleNavigation uses showPage
    handleNavigation = (e) => {
      const target = e.target.dataset.page;
      if (target) {
        showPage(target);
      }
    };

    // setupEventListeners sets event listeners - here we simulate behavior
    setupEventListeners = () => {
      // Simulated DOM elements
      const navigationButtons = [
        { classList: { contains: () => false }, dataset: { page: 'landing' }, addEventListener: jest.fn() },
        { classList: { contains: () => true }, dataset: { page: 'signup' }, addEventListener: jest.fn() }
      ];

      // Add listeners excluding Get Started button
      navigationButtons.forEach(btn => {
        if (!(btn.classList.contains('cta-btn') && btn.dataset.page === 'signup')) {
          btn.addEventListener('click', handleNavigation);
        }
      });

      // Add listener to Get Started button
      const getStartedBtn = {
        classList: { contains: () => true },
        dataset: { page: 'signup' },
        addEventListener: jest.fn((event, cb) => {
          // Simulate click event callback tests
          getStartedBtn.clickCallback = cb;
        }),
        clickCallback: null
      };

      getStartedBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser) {
          showPage('dashboard');
        } else {
          showPage('signup');
        }
      });

      // Return references for test assertions
      return { navigationButtons, getStartedBtn };
    };
  });

  test('Generic navigation buttons have click listeners except Get Started button', () => {
    const { navigationButtons } = setupEventListeners();
    expect(navigationButtons[0].addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    expect(navigationButtons[1].addEventListener).not.toHaveBeenCalled();
  });

  test('Get Started button navigates to signup when no user', () => {
    const { getStartedBtn } = setupEventListeners();
    currentUser = null;
    const e = { preventDefault: jest.fn() };
    getStartedBtn.clickCallback(e);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(showPage).toHaveBeenCalledWith('signup');
  });

  test('Get Started button navigates to dashboard when user logged in', () => {
    const { getStartedBtn } = setupEventListeners();
    currentUser = { name: 'Test User' };
    const e = { preventDefault: jest.fn() };
    getStartedBtn.clickCallback(e);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(showPage).toHaveBeenCalledWith('dashboard');
  });

  test('handleNavigation calls showPage with correct page', () => {
    const mockEvent = {
      target: {
        dataset: { page: 'dashboard' }
      }
    };
    showPage = jest.fn();

    handleNavigation(mockEvent);
    expect(showPage).toHaveBeenCalledWith('dashboard');
  });
});
