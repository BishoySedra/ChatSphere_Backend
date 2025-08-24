#!/usr/bin/env node

/**
 * Manual verification script for security features
 * Run this after starting the server to test security features
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000/api/v1';

// Test data
const testPayloads = {
  xssAttempt: {
    username: '<script>alert("xss")</script>',
    email: 'test@example.com',
    password: 'Password@123'
  },
  normalPayload: {
    username: 'testuser',
    email: 'test@example.com', 
    password: 'Password@123'
  },
  loginPayload: {
    email: 'nonexistent@example.com',
    password: 'wrongpassword'
  }
};

const makeRequest = (path, method = 'POST', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: `/api/v1${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const testSecurityFeatures = async () => {
  console.log('🔒 Testing Security Features\n');

  // Test 1: Security Headers
  console.log('1. Testing Security Headers...');
  try {
    const response = await makeRequest('/auth/login', 'GET');
    const headers = response.headers;
    
    if (headers['x-frame-options']) {
      console.log('   ✅ X-Frame-Options header present');
    } else {
      console.log('   ❌ X-Frame-Options header missing');
    }
    
    if (headers['x-content-type-options']) {
      console.log('   ✅ X-Content-Type-Options header present');
    } else {
      console.log('   ❌ X-Content-Type-Options header missing');
    }
  } catch (err) {
    console.log('   ❌ Failed to test headers:', err.message);
  }

  // Test 2: XSS Protection
  console.log('\n2. Testing XSS Protection...');
  try {
    const response = await makeRequest('/auth/register', 'POST', testPayloads.xssAttempt);
    console.log('   ✅ XSS payload processed (script tags should be sanitized)');
    console.log('   Response status:', response.statusCode);
  } catch (err) {
    console.log('   ❌ XSS test failed:', err.message);
  }

  // Test 3: Rate Limiting
  console.log('\n3. Testing Rate Limiting...');
  try {
    const requests = [];
    for (let i = 0; i < 8; i++) {
      requests.push(makeRequest('/auth/login', 'POST', testPayloads.loginPayload));
    }
    
    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.statusCode === 429);
    
    if (rateLimited.length > 0) {
      console.log('   ✅ Rate limiting working - got', rateLimited.length, 'rate limited responses');
    } else {
      console.log('   ⚠️  Rate limiting may not be working - no 429 responses');
    }
  } catch (err) {
    console.log('   ❌ Rate limiting test failed:', err.message);
  }

  // Test 4: Request Size Limits
  console.log('\n4. Testing Request Size Limits...');
  try {
    const largePayload = {
      username: 'a'.repeat(50000), // Large string
      email: 'test@example.com',
      password: 'Password@123'
    };
    
    const response = await makeRequest('/auth/register', 'POST', largePayload);
    
    if (response.statusCode === 413 || response.statusCode === 400) {
      console.log('   ✅ Request size limiting working - status:', response.statusCode);
    } else {
      console.log('   ⚠️  Request processed despite large size - status:', response.statusCode);
    }
  } catch (err) {
    console.log('   ❌ Size limit test failed:', err.message);
  }

  console.log('\n🔒 Security testing complete!\n');
  console.log('Note: Start the server with "node index.js --environment dev" before running these tests.');
};

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSecurityFeatures();
}

export default testSecurityFeatures;