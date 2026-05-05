// ─── Users ─────────────────────────────────────────────────────────────────────
let editingUserId = null;

function renderUsers(query = '') {
  let users = UserController.getAll();
  if (query) {
    const q = query.toLowerCase();
    users = users.filter(u => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q));
  }
  document.getElementById('user-count').textContent = users.length;
  const tbody = document.getElementById('users-tbody');
  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="table-empty"><div class="empty-icon">👥</div>No users found</td></tr>`;
    return;
  }
  tbody.innerHTML = users.map(u => `
    <tr>
      <td><span class="user-avatar" style="width:30px;height:30px;font-size:12px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:linear-gradient(135deg,var(--accent),#93c5fd);color:#fff;font-weight:700;">${u.username[0].toUpperCase()}</span></td>
      <td><span class="fw-semibold">${Utils.sanitize(u.username)}</span></td>
      <td>${Utils.sanitize(u.email)}</td>
      <td><span class="badge-role ${u.role}">${u.role}</span></td>
      <td>${Utils.formatDateShort(u.createdAt)}</td>
      <td>
        <button class="btn-icon edit me-1" onclick="openUserModal('${u.id}')" title="Edit">✏️</button>
        <button class="btn-icon delete" onclick="deleteUser('${u.id}')" title="Delete">🗑️</button>
      </td>
    </tr>`).join('');
}

function openUserModal(id = null) {
  editingUserId = id;
  const modal = new bootstrap.Modal(document.getElementById('userModal'));
  document.getElementById('user-form').reset();
  document.getElementById('user-modal-error').textContent = '';
  document.getElementById('userModalLabel').textContent = id ? '✏️ Edit User' : '➕ Add User';
  document.getElementById('user-password-hint').textContent = id ? '(leave blank to keep current)' : '';

  if (id) {
    const user = DB.getUserById(id);
    if (!user) return;
    document.getElementById('user-username').value = user.username;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-role').value = user.role;
  }
  modal.show();
}

document.getElementById('user-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('user-username').value;
  const password = document.getElementById('user-password').value;
  const role = document.getElementById('user-role').value;
  const email = document.getElementById('user-email').value;
  const errEl = document.getElementById('user-modal-error');

  let result;
  if (editingUserId) {
    result = UserController.update(editingUserId, username, password, role, email);
  } else {
    result = UserController.add(username, password, role, email);
  }

  if (!result.ok) { errEl.textContent = result.msg; return; }
  errEl.textContent = '';
  bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
  renderUsers(document.getElementById('user-search').value);
  Utils.showToast(result.msg, 'success');
});

function deleteUser(id) {
  if (!Utils.confirmAction('Delete this user? This cannot be undone.')) return;
  const result = UserController.remove(id);
  if (!result.ok) { Utils.showToast(result.msg, 'danger'); return; }
  renderUsers(document.getElementById('user-search').value);
  Utils.showToast(result.msg, 'success');
}

document.getElementById('user-search').addEventListener('input', e => renderUsers(e.target.value));
document.getElementById('btn-add-user').addEventListener('click', () => openUserModal());
