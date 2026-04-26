# Vulnerable Login Application - Educational Cybersecurity Demo

> **⚠️ WARNING: This application contains INTENTIONAL security vulnerabilities for educational purposes only. Never use this code in production!**

## Overview

This is a deliberately vulnerable web application designed to demonstrate how SQL injection-style attacks can bypass authentication. It's intended for use with **Burp Suite** to teach cybersecurity concepts in a controlled educational environment.

---

## Project Structure

```
burp_test_website/
├── package.json          # Node.js dependencies and scripts
├── server.js             # Express backend with vulnerable login endpoint
├── public/
│   └── index.html        # Frontend login page (HTML/CSS/JS)
└── README.md             # This file
```

---

## Team

**Created by:**
- Aishi De (23070521008)
- Parthiv Abhani (23070521106)
- Shlok Vij (23070521143)

---

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **Burp Suite** (for testing the vulnerability)

---

## Installation & Setup

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Cross-Origin Resource Sharing middleware

### 2. Start the Server

```bash
npm start
```

You should see output like:

```
========================================
Vulnerable Login Server Running
========================================
Server URL: http://localhost:3000
Login Endpoint: POST http://localhost:3000/login

Valid credentials for testing:
  - Username: admin, Password: admin123
  - Username: user, Password: password123
  - Username: test, Password: test123

SQL Injection test payload:
  - Username: admin' --, Password: anything
========================================
```

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## How to Test with Burp Suite

### Normal Login (Should Work)
1. Open Burp Suite and configure your browser proxy
2. Enter credentials: `admin` / `admin123`
3. Click "Sign In"
4. Observe the successful response in Burp Suite

### SQL Injection Attack (Authentication Bypass)
1. In the username field, enter: `admin' --`
2. In the password field, enter: anything (e.g., `wrongpassword`)
3. Click "Sign In"
4. **Result:** Login succeeds even with wrong password!

### Why This Works

The payload `admin' --` exploits the vulnerable code:

```javascript
// Vulnerable code (simulating SQL behavior)
const queryPattern = `username = '${username}' AND password = '${password}'`;
```

When the input is `admin' --`, the query becomes:
```sql
username = 'admin' --' AND password = 'anything'
```

The `--` comments out everything after it, effectively bypassing the password check!

---

## API Documentation

### POST /login

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful"
}
```

**Failure Response:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## Security Note

This application is **INTENTIONALLY VULNERABLE** for educational purposes. The vulnerabilities demonstrated include:

1. **SQL Injection-style attack** - User input not sanitized
2. **Authentication bypass** - Comment syntax exploited
3. **No input validation** - Direct string concatenation

**DO NOT** deploy this to any production environment or expose it to the internet!

---

## Learning Objectives

After testing this application, you should understand:

- How SQL injection attacks work
- Why input sanitization is critical
- How to use Burp Suite for security testing
- The importance of parameterized queries
- How authentication mechanisms can be bypassed

---

## License

This project is for educational purposes only.