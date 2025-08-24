# Security Features Documentation

This document outlines the security features implemented in the ChatSphere Backend application to protect against common vulnerabilities.

## 🔒 Security Features Implemented

### 1. Rate Limiting
Protects against brute force attacks and API abuse.

- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **General API endpoints**: 100 requests per 15 minutes per IP  
- **Sensitive operations**: 3 requests per hour per IP
- Uses `express-rate-limit` middleware
- Returns 429 status code when limits are exceeded

### 2. Security Headers
Implemented using `helmet` middleware to protect against various attacks.

- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Enables XSS filtering
- **Content-Security-Policy**: Controls resource loading
- **Strict-Transport-Security**: Enforces HTTPS connections
- **Referrer-Policy**: Controls referrer information

### 3. XSS Protection
Prevents Cross-Site Scripting attacks through input sanitization.

- All request data (body, query, params) is sanitized
- Uses `xss` library to remove malicious scripts
- HTML tags are stripped from user inputs
- Script tags are completely removed

### 4. NoSQL Injection Protection
Prevents MongoDB injection attacks.

- Uses `express-mongo-sanitize` middleware
- Removes prohibited characters like `$` and `.`
- Protects against query injection attempts

### 5. HTTP Parameter Pollution Protection
Prevents parameter pollution attacks.

- Uses `hpp` middleware
- Protects against duplicate parameter attacks
- Ensures parameter uniqueness

### 6. Request Size Limits
Prevents Denial of Service attacks through large payloads.

- JSON payload limit: 10MB
- URL-encoded payload limit: 10MB
- Returns 413 status code for oversized requests

### 7. Login Attempt Tracking
Protects against brute force login attacks.

- Tracks failed login attempts per IP and email combination
- Locks account after 5 failed attempts within 15 minutes
- Automatically unlocks after lockout period expires
- Clears failed attempts on successful login

### 8. Improved Error Handling
Prevents information disclosure through error messages.

- Generic error messages for unexpected errors
- Detailed errors only for known custom errors
- Proper logging for debugging while maintaining security

### 9. Trust Proxy Configuration
Ensures correct IP address identification.

- Configured for reverse proxy environments
- Enables accurate rate limiting and attempt tracking
- Works correctly behind load balancers

### 10. Dependency Security
Addresses known vulnerabilities in dependencies.

- Updated `multer` to latest version to fix CVE-2022-24434
- Regular security audit of npm packages
- Uses latest stable versions of security middleware

## 🛡️ Protected Against

- **Cross-Site Scripting (XSS)**
- **NoSQL Injection Attacks**
- **Brute Force Attacks**
- **Clickjacking**
- **MIME Type Sniffing**
- **HTTP Parameter Pollution**
- **Denial of Service (DoS)**
- **Information Disclosure**
- **Session Hijacking**
- **CSRF (partial protection through headers)**

## 🔧 Configuration

### Environment Variables
No additional environment variables are required for security features. They use sensible defaults.

### Customization
Security settings can be customized in:
- `src/middlewares/security/rateLimiter.js` - Rate limiting configuration
- `src/middlewares/security/sanitizer.js` - XSS protection settings
- `src/middlewares/security/loginAttempts.js` - Login attempt limits
- `starter.js` - Security headers and general configuration

## 🧪 Testing Security Features

### Automated Testing
Run the security test suite:
```bash
npm test -- tests/security.test.js
```

### Manual Testing
Use the security testing script:
```bash
# Start the server
node index.js --environment dev

# In another terminal, run tests
node scripts/test-security.js
```

### Manual Security Checks

1. **Test Rate Limiting**:
   ```bash
   # Make multiple rapid requests to trigger rate limiting
   for i in {1..10}; do curl -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"wrong"}'; done
   ```

2. **Test XSS Protection**:
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/register \
   -H "Content-Type: application/json" \
   -d '{"username":"<script>alert(\"xss\")</script>","email":"test@test.com","password":"Password@123"}'
   ```

3. **Test Security Headers**:
   ```bash
   curl -I http://localhost:3000/api/v1/auth/login
   ```

## 📋 Security Checklist

- [x] Rate limiting implemented
- [x] Security headers configured
- [x] XSS protection enabled
- [x] NoSQL injection protection
- [x] Parameter pollution protection
- [x] Request size limits
- [x] Login attempt tracking
- [x] Error message sanitization
- [x] Dependency vulnerabilities addressed
- [x] Trust proxy configured

## 🚀 Next Steps

For additional security, consider implementing:

1. **JWT Token Security**:
   - Shorter token expiry times
   - Refresh token mechanism
   - Token blacklisting

2. **Advanced Rate Limiting**:
   - Distributed rate limiting with Redis
   - Different limits per user type
   - Adaptive rate limiting

3. **Monitoring & Logging**:
   - Security event logging
   - Intrusion detection
   - Real-time monitoring

4. **HTTPS Enforcement**:
   - SSL/TLS configuration
   - Certificate management
   - HSTS enforcement

5. **Advanced Authentication**:
   - Two-factor authentication
   - OAuth integration
   - Account verification improvements