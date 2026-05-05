const UserController = (() => {
  function getAll() { return DB.getUsers(); }

  function add(username, password, role, email) {
    const err = Utils.validateRequired({ Username: username, Password: password, Role: role, Email: email });
    if (err) return { ok: false, msg: err };
    if (DB.getUserByUsername(username)) return { ok: false, msg: 'Username already exists.' };
    if (password.length < 5) return { ok: false, msg: 'Password must be at least 5 characters.' };
    DB.addUser(new User(Utils.generateId(), username.trim(), password, role, email.trim()));
    return { ok: true, msg: 'User added successfully.' };
  }

  function update(id, username, password, role, email) {
    const existing = DB.getUserById(id);
    if (!existing) return { ok: false, msg: 'User not found.' };
    const err = Utils.validateRequired({ Username: username, Role: role, Email: email });
    if (err) return { ok: false, msg: err };
    const dup = DB.getUserByUsername(username);
    if (dup && dup.id !== id) return { ok: false, msg: 'Username already exists.' };
    const updated = new User(id, username.trim(), password || existing.password, role, email.trim(), existing.createdAt);
    DB.updateUser(updated);
    return { ok: true, msg: 'User updated successfully.' };
  }

  function remove(id) {
    const current = DB.getCurrentUser();
    if (current && current.id === id) return { ok: false, msg: 'Cannot delete currently logged-in user.' };
    DB.deleteUser(id);
    return { ok: true, msg: 'User deleted.' };
  }

  function login(username, password) {
    const user = DB.getUserByUsername(username);
    if (!user) return { ok: false, msg: 'Invalid username or password.' };
    if (user.password !== password) return { ok: false, msg: 'Invalid username or password.' };
    DB.setCurrentUser(user);
    return { ok: true, user };
  }

  function logout() {
    DB.clearSession();
  }

  return { getAll, add, update, remove, login, logout };
})();
