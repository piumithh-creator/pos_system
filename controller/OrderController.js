const OrderController = (() => {
  let cart = [];

  function getCart() { return cart; }

  function clearCart() { cart = []; }

  function addToCart(itemCode, qty) {
    const item = DB.getItemByCode(itemCode);
    if (!item) return { ok: false, msg: 'Item not found.' };
    qty = parseInt(qty);
    if (isNaN(qty) || qty <= 0) return { ok: false, msg: 'Invalid quantity.' };

    const existing = cart.find(c => c.itemCode === itemCode);
    const needed = existing ? existing.qty + qty : qty;
    if (needed > item.qty) return { ok: false, msg: `Only ${item.qty} units available for ${item.itemName}.` };

    if (existing) {
      existing.qty += qty;
      existing.total = existing.qty * existing.unitPrice;
    } else {
      cart.push(new OrderItem(item.itemCode, item.itemName, qty, item.unitPrice));
    }
    return { ok: true, msg: 'Item added to cart.' };
  }

  function removeFromCart(itemCode) {
    cart = cart.filter(c => c.itemCode !== itemCode);
  }

  function updateCartQty(itemCode, qty) {
    qty = parseInt(qty);
    const cartItem = cart.find(c => c.itemCode === itemCode);
    if (!cartItem) return { ok: false, msg: 'Item not in cart.' };
    const item = DB.getItemByCode(itemCode);
    if (qty <= 0) { removeFromCart(itemCode); return { ok: true }; }
    if (qty > item.qty) return { ok: false, msg: `Only ${item.qty} units available.` };
    cartItem.qty = qty;
    cartItem.total = cartItem.qty * cartItem.unitPrice;
    return { ok: true };
  }

  function getCartTotals(discount = 0) {
    const subtotal = cart.reduce((s, i) => s + i.total, 0);
    const total = Math.max(0, subtotal - parseFloat(discount));
    return { subtotal, discount: parseFloat(discount), total };
  }

  function placeOrder(customerId, discount = 0) {
    if (!customerId) return { ok: false, msg: 'Please select a customer.' };
    if (cart.length === 0) return { ok: false, msg: 'Cart is empty.' };
    const customer = DB.getCustomerById(customerId);
    if (!customer) return { ok: false, msg: 'Customer not found.' };

    // Reduce stock
    for (const c of cart) {
      const res = ItemController.reduceStock(c.itemCode, c.qty);
      if (!res.ok) return res;
    }

    const order = new Order(
      Utils.generateId(),
      Utils.generateOrderId(),
      customerId,
      customer.name,
      JSON.parse(JSON.stringify(cart)),
      discount
    );
    DB.addOrder(order);
    clearCart();
    return { ok: true, msg: 'Order placed successfully!', order };
  }

  function getAll() { return DB.getOrders(); }

  function search(orderId, date) {
    return DB.getOrders().filter(o => {
      const matchId = !orderId || o.orderId.toLowerCase().includes(orderId.toLowerCase());
      const matchDate = !date || Utils.formatDateShort(o.date) === Utils.formatDateShort(new Date(date).toISOString());
      return matchId && matchDate;
    });
  }

  function remove(id) {
    DB.deleteOrder(id);
    return { ok: true, msg: 'Order deleted.' };
  }

  return { getCart, clearCart, addToCart, removeFromCart, updateCartQty, getCartTotals, placeOrder, getAll, search, remove };
})();
