// ─── Order History ─────────────────────────────────────────────────────────────
function renderOrderHistory() {
  const orderId = document.getElementById('history-search-id').value;
  const date = document.getElementById('history-search-date').value;
  const orders = OrderController.search(orderId, date);

  document.getElementById('history-count').textContent = orders.length;

  const tbody = document.getElementById('history-tbody');
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="table-empty"><div class="empty-icon">📋</div>No orders found</td></tr>`;
    return;
  }

  const sorted = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
  tbody.innerHTML = sorted.map(o => `
    <tr>
      <td><span class="fw-semibold text-primary">${Utils.sanitize(o.orderId)}</span></td>
      <td>${Utils.sanitize(o.customerName)}</td>
      <td>${o.items.length} item(s)</td>
      <td>${Utils.formatCurrency(o.subtotal)}</td>
      <td>${Utils.formatCurrency(o.discount)}</td>
      <td><span class="fw-bold" style="color:var(--success)">${Utils.formatCurrency(o.total)}</span></td>
      <td>${Utils.formatDate(o.date)}</td>
      <td>
        <button class="btn-icon view me-1" onclick="viewOrderDetail('${o.id}')" title="View">👁️</button>
        <button class="btn-icon print me-1" onclick="printOrder('${o.id}')" title="Print">🖨️</button>
        <button class="btn-icon delete" onclick="deleteOrderHistory('${o.id}')" title="Delete">🗑️</button>
      </td>
    </tr>`).join('');
}

function viewOrderDetail(id) {
  const order = DB.getOrderById(id);
  if (!order) return;
  const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));

  document.getElementById('detail-order-id').textContent = order.orderId;
  document.getElementById('detail-customer').textContent = order.customerName;
  document.getElementById('detail-date').textContent = Utils.formatDate(order.date);
  document.getElementById('detail-subtotal').textContent = Utils.formatCurrency(order.subtotal);
  document.getElementById('detail-discount').textContent = Utils.formatCurrency(order.discount);
  document.getElementById('detail-total').textContent = Utils.formatCurrency(order.total);

  document.getElementById('detail-items-list').innerHTML = order.items.map(i => `
    <div class="order-detail-item">
      <div class="flex-1">
        <div class="fw-semibold">${Utils.sanitize(i.itemName)}</div>
        <div class="text-secondary" style="font-size:12px">${Utils.sanitize(i.itemCode)}</div>
      </div>
      <div class="text-center" style="width:60px">${i.qty}x</div>
      <div style="width:80px;text-align:right">${Utils.formatCurrency(i.unitPrice)}</div>
      <div class="fw-bold text-primary" style="width:90px;text-align:right">${Utils.formatCurrency(i.total)}</div>
    </div>`).join('');

  document.getElementById('detail-print-btn').onclick = () => Utils.printBill(order);
  modal.show();
}

function printOrder(id) {
  const order = DB.getOrderById(id);
  if (order) Utils.printBill(order);
}

function deleteOrderHistory(id) {
  if (!Utils.confirmAction('Delete this order record?')) return;
  const result = OrderController.remove(id);
  renderOrderHistory();
  Utils.showToast(result.msg, 'success');
}

document.getElementById('history-search-id').addEventListener('input', renderOrderHistory);
document.getElementById('history-search-date').addEventListener('change', renderOrderHistory);
document.getElementById('btn-clear-history-filter').addEventListener('click', () => {
  document.getElementById('history-search-id').value = '';
  document.getElementById('history-search-date').value = '';
  renderOrderHistory();
});
