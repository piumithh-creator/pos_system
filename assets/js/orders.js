// ─── Orders ────────────────────────────────────────────────────────────────────
function renderOrderPage() {
  populateOrderCustomers();
  populateItemSelect();
  OrderController.clearCart();
  renderCart();
  document.getElementById('order-item-code').value = '';
  document.getElementById('order-item-qty').value = '1';
  document.getElementById('order-discount').value = '0';
  document.getElementById('order-item-info').textContent = '';
}

function populateOrderCustomers() {
  const select = document.getElementById('order-customer');
  const customers = DB.getCustomers();
  select.innerHTML = '<option value="">-- Select Customer --</option>' +
    customers.map(c => `<option value="${c.id}">${Utils.sanitize(c.name)} (${Utils.sanitize(c.contact)})</option>`).join('');
}

function populateItemSelect() {
  const select = document.getElementById('order-item-select');
  const items = DB.getItems().filter(i => i.qty > 0);
  select.innerHTML = '<option value="">-- Select Item --</option>' +
    items.map(i => `<option value="${i.itemCode}">${Utils.sanitize(i.itemCode)} - ${Utils.sanitize(i.itemName)} (${Utils.formatCurrency(i.unitPrice)}) [Stock: ${i.qty}]</option>`).join('');
}

document.getElementById('order-item-select').addEventListener('change', function () {
  const item = DB.getItemByCode(this.value);
  if (item) {
    document.getElementById('order-item-code').value = item.itemCode;
    document.getElementById('order-item-info').textContent = `${item.itemName} — ${Utils.formatCurrency(item.unitPrice)} | Stock: ${item.qty}`;
  } else {
    document.getElementById('order-item-code').value = '';
    document.getElementById('order-item-info').textContent = '';
  }
});

document.getElementById('order-item-code').addEventListener('blur', function () {
  if (this.value) {
    const item = DB.getItemByCode(this.value.trim().toUpperCase());
    if (item) {
      document.getElementById('order-item-select').value = item.itemCode;
      document.getElementById('order-item-info').textContent = `${item.itemName} — ${Utils.formatCurrency(item.unitPrice)} | Stock: ${item.qty}`;
    }
  }
});

document.getElementById('btn-add-to-cart').addEventListener('click', () => {
  let code = document.getElementById('order-item-select').value || document.getElementById('order-item-code').value.trim().toUpperCase();
  const qty = document.getElementById('order-item-qty').value;
  if (!code) { Utils.showToast('Please select an item.', 'warning'); return; }
  const result = OrderController.addToCart(code, qty);
  if (!result.ok) { Utils.showToast(result.msg, 'danger'); return; }
  Utils.showToast(result.msg, 'success');
  renderCart();
  document.getElementById('order-item-select').value = '';
  document.getElementById('order-item-code').value = '';
  document.getElementById('order-item-qty').value = '1';
  document.getElementById('order-item-info').textContent = '';
});

document.getElementById('order-discount').addEventListener('input', renderCart);

function renderCart() {
  const cart = OrderController.getCart();
  const cartBody = document.getElementById('cart-items');
  const discount = parseFloat(document.getElementById('order-discount').value) || 0;
  const totals = OrderController.getCartTotals(discount);

  if (cart.length === 0) {
    cartBody.innerHTML = `<div class="cart-empty">🛒<br>Cart is empty<br><small>Add items to begin</small></div>`;
  } else {
    cartBody.innerHTML = cart.map(c => `
      <div class="cart-item">
        <div class="flex-1">
          <div class="cart-item-name">${Utils.sanitize(c.itemName)}</div>
          <div class="cart-item-code">${Utils.sanitize(c.itemCode)} · ${Utils.formatCurrency(c.unitPrice)} each</div>
        </div>
        <input type="number" class="cart-qty-input" value="${c.qty}" min="1"
          onchange="updateCartQty('${c.itemCode}', this.value)">
        <div class="cart-item-price">${Utils.formatCurrency(c.total)}</div>
        <button class="btn-icon delete" onclick="removeFromCart('${c.itemCode}')" style="width:24px;height:24px;font-size:12px;">✕</button>
      </div>`).join('');
  }

  document.getElementById('cart-subtotal').textContent = Utils.formatCurrency(totals.subtotal);
  document.getElementById('cart-discount-display').textContent = '- ' + Utils.formatCurrency(totals.discount);
  document.getElementById('cart-total').textContent = Utils.formatCurrency(totals.total);
}

function removeFromCart(code) {
  OrderController.removeFromCart(code);
  renderCart();
}

function updateCartQty(code, qty) {
  const result = OrderController.updateCartQty(code, qty);
  if (!result.ok) Utils.showToast(result.msg, 'danger');
  renderCart();
}

document.getElementById('btn-place-order').addEventListener('click', () => {
  const customerId = document.getElementById('order-customer').value;
  const discount = parseFloat(document.getElementById('order-discount').value) || 0;
  const result = OrderController.placeOrder(customerId, discount);
  if (!result.ok) { Utils.showToast(result.msg, 'danger'); return; }
  Utils.showToast(result.msg, 'success');
  populateItemSelect();
  renderCart();

  // Ask to print
  if (confirm(`Order ${result.order.orderId} placed! Print receipt?`)) {
    Utils.printBill(result.order);
  }
});

document.getElementById('btn-clear-cart').addEventListener('click', () => {
  if (OrderController.getCart().length === 0) return;
  if (Utils.confirmAction('Clear entire cart?')) {
    OrderController.clearCart();
    renderCart();
  }
});
