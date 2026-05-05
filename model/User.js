class User {
  constructor(id, username, password, role, email, createdAt = new Date().toISOString()) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role; // 'admin' | 'cashier'
    this.email = email;
    this.createdAt = createdAt;
  }
}
