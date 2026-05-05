class Customer {
  constructor(id, name, contact, address, email = '', createdAt = new Date().toISOString()) {
    this.id = id;
    this.name = name;
    this.contact = contact;
    this.address = address;
    this.email = email;
    this.createdAt = createdAt;
  }
}
