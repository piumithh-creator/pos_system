// ─── Customers ─────────────────────────────────────────────────────────────────
let editingCustomerId = null;

function renderCustomers(query = '') {
  const customers = query ? CustomerController.search(query) : CustomerController.getAll();
  document.getElementById('customer-count').textContent = customers.length;
  const tbody = document.getElementById('customers-tbody');
  if (customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="table-empty"><div class="empty-icon">🧑‍🤝‍🧑</div>No customers found</td></tr>`;
    return;
  }
  tbody.innerHTML = customers.map(c => `
    <tr>
      <td><small class="text-secondary fw-mono">${Utils.sanitize(c.id).slice(-8)}</small></td>
      <td><span class="fw-semibold">${Utils.sanitize(c.name)}</span></td>
      <td>${Utils.sanitize(c.contact)}</td>
      <td>${Utils.sanitize(c.address)}</td>
      <td>${Utils.sanitize(c.email || '-')}</td>
      <td>
        <button class="btn-icon edit me-1" onclick="openCustomerModal('${c.id}')" title="Edit">✏️</button>
        <button class="btn-icon delete" onclick="deleteCustomer('${c.id}')" title="Delete">🗑️</button>
      </td>
    </tr>`).join('');
}

function openCustomerModal(id = null) {
  editingCustomerId = id;
  const modal = new bootstrap.Modal(document.getElementById('customerModal'));
  document.getElementById('customer-form').reset();
  document.getElementById('customer-modal-error').textContent = '';
  document.getElementById('customerModalLabel').textContent = id ? '✏️ Edit Customer' : '➕ Add Customer';

  if (id) {
    const c = DB.getCustomerById(id);
    if (!c) return;
    document.getElementById('customer-name').value = c.name;
    document.getElementById('customer-contact').value = c.contact;
    document.getElementById('customer-address').value = c.address;
    document.getElementById('customer-email').value = c.email || '';
  }
  modal.show();
}

document.getElementById('customer-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('customer-name').value;
  const contact = document.getElementById('customer-contact').value;
  const address = document.getElementById('customer-address').value;
  const email = document.getElementById('customer-email').value;
  const errEl = document.getElementById('customer-modal-error');

  let result;
  if (editingCustomerId) {
    result = CustomerController.update(editingCustomerId, name, contact, address, email);
  } else {
    result = CustomerController.add(name, contact, address, email);
  }

  if (!result.ok) { errEl.textContent = result.msg; return; }
  errEl.textContent = '';
  bootstrap.Modal.getInstance(document.getElementById('customerModal')).hide();
  renderCustomers(document.getElementById('customer-search').value);
  Utils.showToast(result.msg, 'success');
});

function deleteCustomer(id) {
  if (!Utils.confirmAction('Delete this customer?')) return;
  const result = CustomerController.remove(id);
  renderCustomers(document.getElementById('customer-search').value);
  Utils.showToast(result.msg, 'success');
}

document.getElementById('customer-search').addEventListener('input', e => renderCustomers(e.target.value));
document.getElementById('btn-add-customer').addEventListener('click', () => openCustomerModal());
