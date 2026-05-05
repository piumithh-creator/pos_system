const Utils = (() => {
  function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function generateOrderId() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `ORD-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${Math.floor(Math.random()*9000)+1000}`;
  }

  function formatCurrency(amount) {
    return 'LKR ' + parseFloat(amount).toFixed(2);
  }

  function formatDate(isoString) {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'});
  }

  function formatDateShort(isoString) {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('en-GB');
  }

  function validateRequired(fields) {
    for (const [name, val] of Object.entries(fields)) {
      if (!val || String(val).trim() === '') return `${name} is required.`;
    }
    return null;
  }

  function validatePositiveNumber(value, fieldName) {
    if (isNaN(value) || parseFloat(value) <= 0) return `${fieldName} must be a positive number.`;
    return null;
  }

  function validatePositiveInt(value, fieldName) {
    if (!Number.isInteger(Number(value)) || parseInt(value) <= 0) return `${fieldName} must be a positive whole number.`;
    return null;
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const id = 'toast_' + Date.now();
    const icons = { success: '✓', danger: '✕', warning: '⚠', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0 show mb-2`;
    toast.setAttribute('role', 'alert');
    toast.id = id;
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body fw-semibold">
          <span class="me-2">${icons[type] || ''}</span>${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="document.getElementById('${id}').remove()"></button>
      </div>`;
    container.appendChild(toast);
    setTimeout(() => { if (document.getElementById(id)) document.getElementById(id).remove(); }, 3500);
  }

  function confirmAction(message) {
    return window.confirm(message);
  }

  function sanitize(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function printBill(order) {
    const items = order.items.map(i =>
      `<tr>
        <td>${sanitize(i.itemCode)}</td>
        <td>${sanitize(i.itemName)}</td>
        <td class="text-center">${i.qty}</td>
        <td class="text-end">${formatCurrency(i.unitPrice)}</td>
        <td class="text-end">${formatCurrency(i.total)}</td>
      </tr>`
    ).join('');

    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Bill - ${order.orderId}</title>
  <style>
    body { font-family: 'Courier New', monospace; max-width: 420px; margin: 20px auto; padding: 20px; }
    h2 { text-align:center; margin-bottom:4px; }
    p { text-align:center; margin:2px 0; font-size:13px; }
    table { width:100%; border-collapse:collapse; margin-top:12px; font-size:13px; }
    th { border-bottom:2px solid #000; padding:4px; text-align:left; }
    td { padding:3px 4px; }
    .text-end { text-align:right; }
    .text-center { text-align:center; }
    .total-row td { border-top:2px solid #000; font-weight:bold; }
    @media print { button { display:none; } }
  </style>
</head>
<body>
  <h2>HSK SUPER</h2>
  <p>Point of Sale Receipt</p>
  <p>Colombo, Sri Lanka</p>
  <hr>
  <p><strong>Order:</strong> ${sanitize(order.orderId)}</p>
  <p><strong>Date:</strong> ${formatDate(order.date)}</p>
  <p><strong>Customer:</strong> ${sanitize(order.customerName)}</p>
  <hr>
  <table>
    <thead><tr><th>Code</th><th>Item</th><th class="text-center">Qty</th><th class="text-end">Price</th><th class="text-end">Total</th></tr></thead>
    <tbody>${items}</tbody>
    <tfoot>
      <tr><td colspan="4" class="text-end">Subtotal:</td><td class="text-end">${formatCurrency(order.subtotal)}</td></tr>
      <tr><td colspan="4" class="text-end">Discount:</td><td class="text-end">- ${formatCurrency(order.discount)}</td></tr>
      <tr class="total-row"><td colspan="4" class="text-end">TOTAL:</td><td class="text-end">${formatCurrency(order.total)}</td></tr>
    </tfoot>
  </table>
  <hr>
  <p style="margin-top:12px;">Thank you for shopping at HSK Super!</p>
  <p>Please come again 😊</p>
  <br>
  <button onclick="window.print()" style="width:100%;padding:8px;font-size:14px;cursor:pointer;">🖨️ Print</button>
</body>
</html>`);
    win.document.close();
  }

  return {
    generateId, generateOrderId, formatCurrency, formatDate, formatDateShort,
    validateRequired, validatePositiveNumber, validatePositiveInt,
    showToast, confirmAction, sanitize, printBill
  };
})();
