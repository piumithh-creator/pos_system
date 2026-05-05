const ItemController = (() => {
  function getAll() { return DB.getItems(); }

  function search(query) {
    const q = query.toLowerCase().trim();
    return DB.getItems().filter(i =>
      i.itemCode.toLowerCase().includes(q) ||
      i.itemName.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  }

  function add(itemCode, itemName, unitPrice, qty, category) {
    const err = Utils.validateRequired({ 'Item Code': itemCode, 'Item Name': itemName, 'Unit Price': unitPrice, 'Quantity': qty });
    if (err) return { ok: false, msg: err };
    const priceErr = Utils.validatePositiveNumber(unitPrice, 'Unit Price');
    if (priceErr) return { ok: false, msg: priceErr };
    const qtyErr = Utils.validatePositiveInt(qty, 'Quantity');
    if (qtyErr) return { ok: false, msg: qtyErr };
    const existing = DB.getItemByCode(itemCode.trim());
    if (existing) return { ok: false, msg: 'Item code already exists.' };
    DB.addItem(new Item(Utils.generateId(), itemCode.trim(), itemName.trim(), unitPrice, qty, category || 'General'));
    return { ok: true, msg: 'Item added successfully.' };
  }

  function update(id, itemCode, itemName, unitPrice, qty, category) {
    const existing = DB.getItemById(id);
    if (!existing) return { ok: false, msg: 'Item not found.' };
    const err = Utils.validateRequired({ 'Item Code': itemCode, 'Item Name': itemName, 'Unit Price': unitPrice, 'Quantity': qty });
    if (err) return { ok: false, msg: err };
    const priceErr = Utils.validatePositiveNumber(unitPrice, 'Unit Price');
    if (priceErr) return { ok: false, msg: priceErr };
    const qtyErr = Utils.validatePositiveInt(qty, 'Quantity');
    if (qtyErr) return { ok: false, msg: qtyErr };
    const dup = DB.getItemByCode(itemCode.trim());
    if (dup && dup.id !== id) return { ok: false, msg: 'Item code already used by another item.' };
    DB.updateItem(new Item(id, itemCode.trim(), itemName.trim(), unitPrice, qty, category || existing.category, existing.createdAt));
    return { ok: true, msg: 'Item updated successfully.' };
  }

  function remove(id) {
    DB.deleteItem(id);
    return { ok: true, msg: 'Item deleted.' };
  }

  function reduceStock(itemCode, qty) {
    const item = DB.getItemByCode(itemCode);
    if (!item) return { ok: false, msg: `Item ${itemCode} not found.` };
    if (item.qty < qty) return { ok: false, msg: `Insufficient stock for ${item.itemName}.` };
    item.qty -= qty;
    DB.updateItem(item);
    return { ok: true };
  }

  return { getAll, search, add, update, remove, reduceStock };
})();
