// ─── Items ─────────────────────────────────────────────────────────────────────
let editingItemId = null;

function renderItems(query = '') {
  const items = query ? ItemController.search(query) : ItemController.getAll();
  document.getElementById('item-count').textContent = items.length;
  const tbody = document.getElementById('items-tbody');
  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="table-empty"><div class="empty-icon">📦</div>No items found</td></tr>`;
    return;
  }
  tbody.innerHTML = items.map(i => `
    <tr>
      <td><span class="fw-semibold text-primary">${Utils.sanitize(i.itemCode)}</span></td>
      <td>${Utils.sanitize(i.itemName)}</td>
      <td><span class="badge" style="background:rgba(0,120,212,0.1);color:var(--accent)">${Utils.sanitize(i.category)}</span></td>
      <td>${Utils.formatCurrency(i.unitPrice)}</td>
      <td>
        <span class="badge-status ${i.qty <= 5 ? 'low' : 'ok'}">${i.qty <= 5 ? '⚠ ' : ''}${i.qty}</span>
      </td>
      <td>${Utils.formatDateShort(i.createdAt)}</td>
      <td>
        <button class="btn-icon edit me-1" onclick="openItemModal('${i.id}')" title="Edit">✏️</button>
        <button class="btn-icon delete" onclick="deleteItem('${i.id}')" title="Delete">🗑️</button>
      </td>
    </tr>`).join('');
}

function openItemModal(id = null) {
  editingItemId = id;
  const modal = new bootstrap.Modal(document.getElementById('itemModal'));
  document.getElementById('item-form').reset();
  document.getElementById('item-modal-error').textContent = '';
  document.getElementById('itemModalLabel').textContent = id ? '✏️ Edit Item' : '➕ Add Item';

  if (id) {
    const item = DB.getItemById(id);
    if (!item) return;
    document.getElementById('item-code').value = item.itemCode;
    document.getElementById('item-name').value = item.itemName;
    document.getElementById('item-price').value = item.unitPrice;
    document.getElementById('item-qty').value = item.qty;
    document.getElementById('item-category').value = item.category;
  }
  modal.show();
}

document.getElementById('item-form').addEventListener('submit', e => {
  e.preventDefault();
  const itemCode = document.getElementById('item-code').value;
  const itemName = document.getElementById('item-name').value;
  const unitPrice = document.getElementById('item-price').value;
  const qty = document.getElementById('item-qty').value;
  const category = document.getElementById('item-category').value;
  const errEl = document.getElementById('item-modal-error');

  let result;
  if (editingItemId) {
    result = ItemController.update(editingItemId, itemCode, itemName, unitPrice, qty, category);
  } else {
    result = ItemController.add(itemCode, itemName, unitPrice, qty, category);
  }

  if (!result.ok) { errEl.textContent = result.msg; return; }
  errEl.textContent = '';
  bootstrap.Modal.getInstance(document.getElementById('itemModal')).hide();
  renderItems(document.getElementById('item-search').value);
  Utils.showToast(result.msg, 'success');
});

function deleteItem(id) {
  if (!Utils.confirmAction('Delete this item?')) return;
  const result = ItemController.remove(id);
  renderItems(document.getElementById('item-search').value);
  Utils.showToast(result.msg, 'success');
}

document.getElementById('item-search').addEventListener('input', e => renderItems(e.target.value));
document.getElementById('btn-add-item').addEventListener('click', () => openItemModal());
