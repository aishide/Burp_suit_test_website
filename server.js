/**
 * Vulnerable Login Server - Educational Cybersecurity Demo
 * 
 * WARNING: This code contains INTENTIONAL security vulnerabilities
 * for educational purposes only. DO NOT use in production!
 * 
 * This demonstrates how SQL injection-style attacks can bypass
 * authentication when user input is not properly sanitized.
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON request bodies

// In-memory user database
// In a real application, this would be a database with hashed passwords
const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'password123' },
    { username: 'test', password: 'test123' }
];

/**
 * VULNERABLE LOGIN ENDPOINT
 * 
 * This endpoint contains an INTENTIONAL vulnerability similar to SQL injection.
 * The code directly concatenates user input into a query-like string without
 * any sanitization or parameterization.
 * 
 * Normal behavior:
 * - username: "admin", password: "admin123" → Login successful
 * 
 * Exploitable behavior (SQL Injection-style):
 * - username: "admin' --", password: "anything" → Login bypassed!
 * 
 * The payload "admin' --" causes the query to become:
 * "username = 'admin' --' AND password = 'anything'"
 * The "--" comments out everything after it, bypassing the password check.
 */
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log(`Login attempt - Username: "${username}", Password: "${password}"`);
    
    // VULNERABLE CODE: Direct string concatenation without sanitization
    // This simulates an insecure SQL query pattern
    const queryPattern = `username = '${username}' AND password = '${password}'`;
    
    console.log(`Generated query pattern: ${queryPattern}`);
    
    // Check if user exists by evaluating the pattern (simulating SQL behavior)
    // In real SQL injection, the attacker would inject: admin' --
    // This would make the query: username = 'admin' --' AND password = 'anything'
    // The -- comments out the rest, bypassing password verification
    
    let isAuthenticated = false;
    let matchedUser = null;
    
    // Simulate the vulnerable query behavior
    for (const user of users) {
        // This is how a vulnerable SQL query might evaluate:
        // SELECT * FROM users WHERE username = 'admin' --' AND password = 'anything'
        // The -- makes everything after it a comment, so password check is skipped
        
        // Check if username matches (first part of the injection attack)
        if (username.includes("'") && username.includes("--")) {
            // SQL Injection detected - extract the base username
            const baseUsername = username.split("'")[0];
            if (user.username === baseUsername) {
                isAuthenticated = true;
                matchedUser = user;
                break;
            }
        } else {
            // Normal login check
            if (user.username === username && user.password === password) {
                isAuthenticated = true;
                matchedUser = user;
                break;
            }
        }
    }
    
    if (isAuthenticated) {
        console.log(`Login successful for user: ${matchedUser.username}`);
        res.json({
            success: true,
            message: "Login successful",
            redirect: "https://canva.link/k2blyuao0z4tj2y"
        });
    } else {
        console.log('Login failed - Invalid credentials');
        res.json({
            success: false,
            message: "Invalid credentials"
        });
    }
});

// Serve static files from public directory
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`Vulnerable Login Server Running`);
    console.log(`========================================`);
    console.log(`Server URL: http://localhost:${PORT}`);
    console.log(`Login Endpoint: POST http://localhost:${PORT}/login`);
    console.log(`\nValid credentials for testing:`);
    console.log(`  - Username: admin, Password: admin123`);
    console.log(`  - Username: user, Password: password123`);
    console.log(`  - Username: test, Password: test123`);
    console.log(`\nSQL Injection test payload:`);
    console.log(`  - Username: admin' --, Password: anything`);
    console.log(`========================================`);
});

module.exports = app;