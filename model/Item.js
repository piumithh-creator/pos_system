class Item {
  constructor(id, itemCode, itemName, unitPrice, qty, category = 'General', createdAt = new Date().toISOString()) {
    this.id = id;
    this.itemCode = itemCode;
    this.itemName = itemName;
    this.unitPrice = parseFloat(unitPrice);
    this.qty = parseInt(qty);
    this.category = category;
    this.createdAt = createdAt;
  }
}
