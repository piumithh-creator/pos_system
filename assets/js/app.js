// ─── App Entry Point ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  DB.seed();
  const currentUser = DB.getCurrentUser();
  if (currentUser) {
    showApp(currentUser);
    navigateTo('dashboard');
  } else {
    showLogin();
  }
  startClock();
});

function startClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const update = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      + '  ' + now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };
  update();
  setInterval(update, 1000);
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
function showLogin() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

function showApp(user) {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  document.getElementById('sidebar-user-name').textContent = user.username;
  document.getElementById('sidebar-user-role').textContent = user.role;
  document.getElementById('sidebar-user-avatar').textContent = user.username[0].toUpperCase();
}

document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const result = UserController.login(username, password);
  const errEl = document.getElementById('login-error');
  if (result.ok) {
    errEl.textContent = '';
    showApp(result.user);
    navigateTo('dashboard');
  } else {
    errEl.textContent = result.msg;
  }
});

document.getElementById('btn-logout').addEventListener('click', () => {
  UserController.logout();
  showLogin();
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
});

// ─── Navigation ────────────────────────────────────────────────────────────────
const pages = ['dashboard', 'users', 'customers', 'items', 'orders', 'order-history'];

function navigateTo(page) {
  pages.forEach(p => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.style.display = 'none';
    const link = document.querySelector(`[data-page="${p}"]`);
    if (link) link.classList.remove('active');
  });

  const target = document.getElementById(`page-${page}`);
  if (target) target.style.display = 'block';
  const activeLink = document.querySelector(`[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Refresh page data
  const titleEl = document.getElementById('page-title');
  const titles = {
    dashboard: '📊 Dashboard', users: '👥 User Management', customers: '🧑‍🤝‍🧑 Customer Management',
    items: '📦 Item Management', orders: '🛒 New Order', 'order-history': '📋 Order History'
  };
  if (titleEl) titleEl.textContent = titles[page] || page;

  if (page === 'dashboard') renderDashboard();
  if (page === 'users') renderUsers();
  if (page === 'customers') renderCustomers();
  if (page === 'items') renderItems();
  if (page === 'orders') renderOrderPage();
  if (page === 'order-history') renderOrderHistory();

  // Close sidebar on mobile
  document.querySelector('.sidebar')?.classList.remove('open');
  document.querySelector('.sidebar-overlay')?.classList.remove('show');
}

document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', () => navigateTo(link.dataset.page));
});

// Mobile sidebar
document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('open');
  document.querySelector('.sidebar-overlay').classList.toggle('show');
});
document.querySelector('.sidebar-overlay')?.addEventListener('click', () => {
  document.querySelector('.sidebar').classList.remove('open');
  document.querySelector('.sidebar-overlay').classList.remove('show');
});
