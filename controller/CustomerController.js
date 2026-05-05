const CustomerController = (() => {
  function getAll() { return DB.getCustomers(); }

  function search(query) {
    const q = query.toLowerCase().trim();
    return DB.getCustomers().filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.contact.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  }

  function add(name, contact, address, email) {
    const err = Utils.validateRequired({ Name: name, Contact: contact, Address: address });
    if (err) return { ok: false, msg: err };
    DB.addCustomer(new Customer(Utils.generateId(), name.trim(), contact.trim(), address.trim(), email.trim()));
    return { ok: true, msg: 'Customer added successfully.' };
  }

  function update(id, name, contact, address, email) {
    const existing = DB.getCustomerById(id);
    if (!existing) return { ok: false, msg: 'Customer not found.' };
    const err = Utils.validateRequired({ Name: name, Contact: contact, Address: address });
    if (err) return { ok: false, msg: err };
    DB.updateCustomer(new Customer(id, name.trim(), contact.trim(), address.trim(), email.trim(), existing.createdAt));
    return { ok: true, msg: 'Customer updated successfully.' };
  }

  function remove(id) {
    DB.deleteCustomer(id);
    return { ok: true, msg: 'Customer deleted.' };
  }

  return { getAll, search, add, update, remove };
})();
