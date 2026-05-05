// ─── Dashboard ─────────────────────────────────────────────────────────────────
function renderDashboard() {
  const customers = DB.getCustomers();
  const items = DB.getItems();
  const orders = DB.getOrders();
  const users = DB.getUsers();

  document.getElementById('stat-customers').textContent = customers.length;
  document.getElementById('stat-items').textContent = items.length;
  document.getElementById('stat-orders').textContent = orders.length;

  const todayStr = new Date().toLocaleDateString('en-GB');
  const todayOrders = orders.filter(o => Utils.formatDateShort(o.date) === todayStr);
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  document.getElementById('stat-revenue').textContent = Utils.formatCurrency(todayRevenue);
  document.getElementById('stat-today-orders').textContent = `${todayOrders.length} orders today`;

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  document.getElementById('stat-total-revenue').textContent = Utils.formatCurrency(totalRevenue);

  const lowStock = items.filter(i => i.qty <= 5);
  document.getElementById('stat-low-stock').textContent = lowStock.length;

  // Recent orders
  const tbody = document.getElementById('dashboard-recent-orders');
  const recent = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="table-empty"><div class="empty-icon">📭</div>No orders yet</td></tr>`;
  } else {
    tbody.innerHTML = recent.map(o => `
      <tr>
        <td><span class="fw-semibold text-primary">${Utils.sanitize(o.orderId)}</span></td>
        <td>${Utils.sanitize(o.customerName)}</td>
        <td>${Utils.formatDate(o.date)}</td>
        <td>${o.items.length} item(s)</td>
        <td><span class="fw-bold" style="color:var(--success)">${Utils.formatCurrency(o.total)}</span></td>
      </tr>`).join('');
  }

  // Low stock
  const lowStockEl = document.getElementById('dashboard-low-stock');
  if (lowStock.length === 0) {
    lowStockEl.innerHTML = `<div class="table-empty"><div class="empty-icon">✅</div>All items have sufficient stock</div>`;
  } else {
    lowStockEl.innerHTML = `<table class="data-table">
      <thead><tr><th>Code</th><th>Item Name</th><th>Qty</th></tr></thead>
      <tbody>${lowStock.map(i => `
        <tr>
          <td>${Utils.sanitize(i.itemCode)}</td>
          <td>${Utils.sanitize(i.itemName)}</td>
          <td><span class="badge-status low">⚠ ${i.qty} left</span></td>
        </tr>`).join('')}
      </tbody>
    </table>`;
  }
}
