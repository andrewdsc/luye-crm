// ==========================================================================
// LUYE CRM - INTERACTION LOGIC (app.js)
// ==========================================================================

// Global Application States
let isLoggedIn = false;
let currentTab = 'home';
let expandedAccordions = {
  functions: false,
  notifications: false,
  reports: false
};

// Initial Setup on DOM Content Loaded
window.addEventListener('DOMContentLoaded', () => {
  // Ensure starting state is correct
  setTab('home');
});

// --- Authentication Controllers ---

/**
 * Handles user login verification
 */
function handleLogin() {
  const accountInput = document.getElementById('input-account').value.trim();
  const passwordInput = document.getElementById('input-password').value.trim();
  const errorDiv = document.getElementById('login-error');
  const errorMsg = document.getElementById('login-error-msg');

  // Input validation check
  if (!accountInput || !passwordInput) {
    errorDiv.classList.remove('hidden');
    errorMsg.innerText = "登入失敗：請輸入帳號與密碼（密碼任意即可登入）。";
    return;
  }

  // Clear errors and toggle logged-in state
  errorDiv.classList.add('hidden');
  isLoggedIn = true;

  // Toggle page visibility with smooth crossfade
  const pageLogin = document.getElementById('page-login');
  const pageSystem = document.getElementById('page-system');

  pageLogin.style.opacity = 0;
  setTimeout(() => {
    pageLogin.classList.add('hidden');
    pageSystem.classList.remove('hidden');
    pageSystem.style.opacity = 1;
    setTab('home'); // Defaults to home dashboard
  }, 200);
}

/**
 * Handles logging out of the application
 */
function handleLogout() {
  isLoggedIn = false;
  toggleSidebar(false);
  
  const pageLogin = document.getElementById('page-login');
  const pageSystem = document.getElementById('page-system');
  
  // Reset input fields
  document.getElementById('input-password').value = "";
  
  pageSystem.classList.add('hidden');
  pageLogin.classList.remove('hidden');
  pageLogin.style.opacity = 1;
}

/**
 * Toggles the visibility of the mobile slide-out sidebar drawer
 * @param {boolean} show - True to open, false to close
 */
function toggleSidebar(show) {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    if (show) {
      sidebar.classList.add('active');
      overlay.classList.remove('hidden');
    } else {
      sidebar.classList.remove('active');
      overlay.classList.add('hidden');
    }
  }
}

// --- Navigation & Sidebar Menu Controllers ---

/**
 * Transitions active workspace tabs and syncs styling for both Desktop sidebar and Mobile navbars
 * @param {string} tabName - Target tab identifier ('home', 'functions', 'notifications', 'reports')
 */
function setTab(tabName) {
  currentTab = tabName;
  toggleSidebar(false);

  const tabs = ['home', 'functions', 'notifications', 'reports'];
  
  // Toggle workspace sections
  tabs.forEach(tab => {
    const el = document.getElementById(`subpage-${tab}`);
    if (el) {
      if (tab === tabName) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    }
  });

  // Update Desktop Sidebar active indicators
  const accHome = document.getElementById('accordion-home');
  if (accHome) {
    if (tabName === 'home') {
      accHome.classList.add('active');
    } else {
      accHome.classList.remove('active');
    }
  }

  // Sync accordion highlights on desktop
  const accordions = ['functions', 'notifications', 'reports'];
  accordions.forEach(acc => {
    const header = document.getElementById(`accordion-${acc}-header`);
    if (header) {
      if (tabName === acc) {
        header.classList.add('active-menu');
        // Auto open if selected on desktop layout
        openAccordionOnly(acc);
      } else {
        header.classList.remove('active-menu');
      }
    }
  });

  // Update Mobile Bottom Navigation indicators
  const mobileNavBtns = {
    home: document.getElementById('nav-btn-home'),
    notifications: document.getElementById('nav-btn-notifications'),
    reports: document.getElementById('nav-btn-reports')
  };

  Object.keys(mobileNavBtns).forEach(key => {
    const btn = mobileNavBtns[key];
    if (btn) {
      if (key === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  // Update Mobile Header icons styling
  const headerBtnFunctions = document.getElementById('header-btn-functions');
  const headerBtnNotifications = document.getElementById('header-btn-notifications');

  if (headerBtnFunctions) {
    if (tabName === 'functions') {
      headerBtnFunctions.style.borderColor = 'var(--brand-500)';
      headerBtnFunctions.style.color = 'var(--brand-600)';
      headerBtnFunctions.style.backgroundColor = 'var(--brand-50)';
    } else {
      headerBtnFunctions.style.borderColor = '';
      headerBtnFunctions.style.color = '';
      headerBtnFunctions.style.backgroundColor = '';
    }
  }

  if (headerBtnNotifications) {
    if (tabName === 'notifications') {
      headerBtnNotifications.style.borderColor = 'var(--brand-500)';
      headerBtnNotifications.style.color = 'var(--brand-600)';
      headerBtnNotifications.style.backgroundColor = 'var(--brand-50)';
    } else {
      headerBtnNotifications.style.borderColor = '';
      headerBtnNotifications.style.color = '';
      headerBtnNotifications.style.backgroundColor = '';
    }
  }
}

/**
 * Handles collapsing/expanding accordion menus in Desktop Sidebar
 * @param {string} menuId - Sidebar accordion group name ('functions', 'notifications', 'reports')
 */
function toggleAccordion(menuId) {
  expandedAccordions[menuId] = !expandedAccordions[menuId];
  
  const content = document.getElementById(`accordion-${menuId}-content`);
  const arrow = document.getElementById(`accordion-${menuId}-arrow`);
  
  if (expandedAccordions[menuId]) {
    // Dynamic height calculation for CSS animation
    content.style.maxHeight = content.scrollHeight + "px";
    content.style.opacity = "1";
    if (arrow) arrow.classList.add('arrow-rotated');
  } else {
    content.style.maxHeight = "0";
    content.style.opacity = "0";
    if (arrow) arrow.classList.remove('arrow-rotated');
  }
}

/**
 * Opens a specific accordion while shutting down others
 * @param {string} menuId - Active menu target
 */
function openAccordionOnly(menuId) {
  const keys = Object.keys(expandedAccordions);
  keys.forEach(k => {
    const content = document.getElementById(`accordion-${k}-content`);
    const arrow = document.getElementById(`accordion-${k}-arrow`);
    
    if (!content) return;
    
    if (k === menuId) {
      expandedAccordions[k] = true;
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.opacity = "1";
      if (arrow) arrow.classList.add('arrow-rotated');
    } else {
      expandedAccordions[k] = false;
      content.style.maxHeight = "0";
      content.style.opacity = "0";
      if (arrow) arrow.classList.remove('arrow-rotated');
    }
  });
}

// --- Overlay Modal Windows Controllers ---

/**
 * Opens or closes the Forgot Password Overlay Modal
 * @param {boolean} show - Toggle true to open, false to close
 */
function toggleForgotPassword(show) {
  const modal = document.getElementById('modal-forgot');
  const errorText = document.getElementById('forgot-error');
  
  // Reset input field
  document.getElementById('forgot-phone').value = "";
  errorText.classList.add('hidden');

  if (show) {
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

/**
 * Validates Taiwan telephone input formats and triggers security verification
 */
function submitForgotPassword() {
  const phone = document.getElementById('forgot-phone').value.trim();
  const errorText = document.getElementById('forgot-error');
  
  // Standard regex for Taiwan mobile numbers: starts with 09, followed by 8 digits
  const phoneRegex = /^09\d{8}$/;
  if (!phoneRegex.test(phone)) {
    errorText.classList.remove('hidden');
    return;
  }

  // Clear errors and hide forgot modal
  errorText.classList.add('hidden');
  toggleForgotPassword(false);
  
  // Show successful verification overlay alert
  openAlertModal("簡訊發送成功", `安全密碼重設驗證碼已發送至 ${phone}，請於 10 分鐘內輸入驗證碼完成重設。`);
}

/**
 * Centered dialog popups for feedback
 * @param {string} title - Alert title text
 * @param {string} desc - Alert descriptive text
 */
function openAlertModal(title, desc) {
  document.getElementById('modal-alert-title').innerText = title;
  document.getElementById('modal-alert-desc').innerText = desc;
  document.getElementById('modal-alert').classList.remove('hidden');
}

function closeAlertModal() {
  document.getElementById('modal-alert').classList.add('hidden');
}

/**
 * Mock actions dispatcher triggered by prototype elements
 * @param {string} featureName - Triggered action identifier
 */
function alertPrototypeAction(featureName) {
  toggleSidebar(false);
  openAlertModal("流程串接成功", `您已成功觸發「${featureName}」模組。此原型完整演示了其在白金綠極簡體系下的響應式介面！`);
}

// --- Specific Warning List Overlay Modals ---

// Unfilled Daily Report Overlay controls
function openDailyReportModal() {
  toggleSidebar(false);
  document.getElementById('modal-daily').classList.remove('hidden');
}
function closeDailyReportModal() {
  document.getElementById('modal-daily').classList.add('hidden');
}

// Client Idle Warnings Overlay controls
function openContactModal() {
  toggleSidebar(false);
  document.getElementById('modal-contact').classList.remove('hidden');
}
function closeContactModal() {
  document.getElementById('modal-contact').classList.add('hidden');
}

// Financial Receivables Warning Overlay controls
function openReceivableModal() {
  toggleSidebar(false);
  document.getElementById('modal-receivable').classList.remove('hidden');
}
function closeReceivableModal() {
  document.getElementById('modal-receivable').classList.add('hidden');
}
