class OrderItem {
  constructor(itemCode, itemName, qty, unitPrice) {
    this.itemCode = itemCode;
    this.itemName = itemName;
    this.qty = parseInt(qty);
    this.unitPrice = parseFloat(unitPrice);
    this.total = this.qty * this.unitPrice;
  }
}

class Order {
  constructor(id, orderId, customerId, customerName, items, discount = 0, date = new Date().toISOString()) {
    this.id = id;
    this.orderId = orderId;
    this.customerId = customerId;
    this.customerName = customerName;
    this.items = items; // Array of OrderItem
    this.discount = parseFloat(discount);
    this.date = date;
    this.subtotal = items.reduce((sum, i) => sum + i.total, 0);
    this.total = this.subtotal - this.discount;
  }
}
