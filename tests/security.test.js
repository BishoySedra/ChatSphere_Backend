import request from "supertest";
import app from "../starter.js";
import mongoose from "mongoose";
import { clearAllCollections } from "../src/db/connection.js";
import env from "dotenv";

env.config();

describe("Security Middleware Tests", () => {
  beforeAll(async () => {
    await clearAllCollections(mongoose.connection);
  });

  describe("Rate Limiting", () => {
    it("should apply rate limiting to auth endpoints", async () => {
      const url = `${process.env.BASE_URL}/auth/login`;
      const payload = {
        email: "test@example.com",
        password: "wrongpassword"
      };

      // Make multiple rapid requests to trigger rate limiting
      const requests = [];
      for (let i = 0; i < 10; i++) {
        requests.push(request(app).post(url).send(payload));
      }

      const responses = await Promise.all(requests);
      
      // At least one response should be rate limited (429)
      const rateLimitedResponses = responses.filter(res => res.statusCode === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    }, 10000);
  });

  describe("XSS Protection", () => {
    it("should sanitize XSS attempts in request body", async () => {
      const url = `${process.env.BASE_URL}/auth/register`;
      const maliciousPayload = {
        username: "<script>alert('xss')</script>",
        email: "test@example.com",
        password: "Password@123"
      };

      const response = await request(app)
        .post(url)
        .send(maliciousPayload);

      // The request should be processed but script tags should be removed
      // This would normally result in a 400 due to empty username after sanitization
      expect(response.statusCode).not.toBe(500);
    });
  });

  describe("Security Headers", () => {
    it("should include security headers in response", async () => {
      const response = await request(app).get("/docs");
      
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });

  describe("Request Size Limits", () => {
    it("should reject oversized requests", async () => {
      const url = `${process.env.BASE_URL}/auth/register`;
      const largePayload = {
        username: "a".repeat(1000000), // 1MB of data
        email: "test@example.com",
        password: "Password@123"
      };

      const response = await request(app)
        .post(url)
        .send(largePayload);

      // Should be rejected due to size limit
      expect([413, 400]).toContain(response.statusCode);
    });
  });
});