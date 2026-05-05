const DB = (() => {
  const KEYS = {
    USERS: 'hsk_users',
    CUSTOMERS: 'hsk_customers',
    ITEMS: 'hsk_items',
    ORDERS: 'hsk_orders',
    CURRENT_USER: 'hsk_current_user',
  };

  function load(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch { return []; }
  }

  function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function loadOne(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || null;
    } catch { return null; }
  }

  // ── Users ──────────────────────────────────────────
  function getUsers() { return load(KEYS.USERS); }
  function saveUsers(users) { save(KEYS.USERS, users); }

  function addUser(user) {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
  }

  function updateUser(updated) {
    const users = getUsers().map(u => u.id === updated.id ? updated : u);
    saveUsers(users);
  }

  function deleteUser(id) {
    saveUsers(getUsers().filter(u => u.id !== id));
  }

  function getUserById(id) {
    return getUsers().find(u => u.id === id) || null;
  }

  function getUserByUsername(username) {
    return getUsers().find(u => u.username === username) || null;
  }

  // ── Session ────────────────────────────────────────
  function setCurrentUser(user) { save(KEYS.CURRENT_USER, user); }
  function getCurrentUser() { return loadOne(KEYS.CURRENT_USER); }
  function clearSession() { localStorage.removeItem(KEYS.CURRENT_USER); }

  // ── Customers ──────────────────────────────────────
  function getCustomers() { return load(KEYS.CUSTOMERS); }
  function saveCustomers(c) { save(KEYS.CUSTOMERS, c); }

  function addCustomer(customer) {
    const list = getCustomers();
    list.push(customer);
    saveCustomers(list);
  }

  function updateCustomer(updated) {
    saveCustomers(getCustomers().map(c => c.id === updated.id ? updated : c));
  }

  function deleteCustomer(id) {
    saveCustomers(getCustomers().filter(c => c.id !== id));
  }

  function getCustomerById(id) {
    return getCustomers().find(c => c.id === id) || null;
  }

  // ── Items ──────────────────────────────────────────
  function getItems() { return load(KEYS.ITEMS); }
  function saveItems(items) { save(KEYS.ITEMS, items); }

  function addItem(item) {
    const list = getItems();
    list.push(item);
    saveItems(list);
  }

  function updateItem(updated) {
    saveItems(getItems().map(i => i.id === updated.id ? updated : i));
  }

  function deleteItem(id) {
    saveItems(getItems().filter(i => i.id !== id));
  }

  function getItemById(id) {
    return getItems().find(i => i.id === id) || null;
  }

  function getItemByCode(code) {
    return getItems().find(i => i.itemCode === code) || null;
  }

  // ── Orders ─────────────────────────────────────────
  function getOrders() { return load(KEYS.ORDERS); }
  function saveOrders(orders) { save(KEYS.ORDERS, orders); }

  function addOrder(order) {
    const list = getOrders();
    list.push(order);
    saveOrders(list);
  }

  function getOrderById(id) {
    return getOrders().find(o => o.id === id) || null;
  }

  function deleteOrder(id) {
    saveOrders(getOrders().filter(o => o.id !== id));
  }

  // ── Seed ──────────────────────────────────────────
  function seed() {
    if (getUsers().length === 0) {
      addUser(new User(Utils.generateId(), 'admin', 'admin123', 'admin', 'admin@hsksuper.com'));
      addUser(new User(Utils.generateId(), 'cashier1', 'cash123', 'cashier', 'cashier@hsksuper.com'));
    }
    if (getItems().length === 0) {
      const sampleItems = [
        ['ITM001', 'Milk 1L', 3.50, 50, 'Dairy'],
        ['ITM002', 'Bread Loaf', 2.20, 30, 'Bakery'],
        ['ITM003', 'Orange Juice', 4.00, 25, 'Beverages'],
        ['ITM004', 'Rice 5kg', 12.00, 20, 'Grains'],
        ['ITM005', 'Butter 250g', 3.80, 40, 'Dairy'],
      ];
      sampleItems.forEach(([code, name, price, qty, cat]) => {
        addItem(new Item(Utils.generateId(), code, name, price, qty, cat));
      });
    }
    if (getCustomers().length === 0) {
      addCustomer(new Customer(Utils.generateId(), 'Walk-in Customer', '0000000000', 'N/A', ''));
      addCustomer(new Customer(Utils.generateId(), 'John Silva', '0771234567', '12 Galle Rd, Colombo', 'john@email.com'));
    }
  }

  return {
    getUsers, addUser, updateUser, deleteUser, getUserById, getUserByUsername,
    setCurrentUser, getCurrentUser, clearSession,
    getCustomers, addCustomer, updateCustomer, deleteCustomer, getCustomerById,
    getItems, addItem, updateItem, deleteItem, getItemById, getItemByCode,
    getOrders, addOrder, getOrderById, deleteOrder,
    seed
  };
})();
