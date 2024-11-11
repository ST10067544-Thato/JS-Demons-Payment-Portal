const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose'); // Import mongoose

// Mock the database interactions
jest.mock('../models/User', () => ({
  findOne: jest.fn(),
}));

// Mock bcrypt.compare for password verification
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('User Routes', () => {
  beforeAll(async () => {
    // Connect to MongoDB
    try {
      await mongoose.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('mongoDB is CONNECTED!!! :)'); // Log connection success
    } catch (err) {
      console.error('MongoDB connection error:', err);
      // Exit the process with a non-zero status code (1) to indicate failure
      process.exit(1);
    }
  });

  afterAll(async () => {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed.'); // Log disconnection
  });

  describe('POST /api/user/login', () => {
    it('should successfully log in a user with valid credentials', async () => {
      const validUser = {
        username: 'testuser',
        accountNumber: '1234567890',
        password: 'password123',
      };

      User.findOne.mockResolvedValue({
        ...validUser,
        _id: 'someUserId',
        role: 'customer',
        fullName: 'Test User',
        password: 'hashedPassword',
      });

      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/user/login')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('role', 'customer');
      expect(response.body).toHaveProperty('fullName', 'Test User');
    });

    it('should return 400 for invalid credentials', async () => {
      const invalidUser = {
        username: 'testuser',
        accountNumber: '1234567890',
        password: 'wrongpassword',
      };

      User.findOne.mockResolvedValue({
        username: 'testuser',
        accountNumber: '1234567890',
        password: 'hashedPassword',
      });

      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/user/login')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should return 400 for invalid username format', async () => {
      const invalidUser = {
        username: 'test user', // Invalid username format (contains space)
        accountNumber: '1234567890',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/user/login')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.text).toContain('Invalid username format.'); // Updated assertion
    });

    it('should return 400 for invalid account number format', async () => {
      const invalidUser = {
        username: 'testuser',
        accountNumber: 'invalidAccountNumber', // Invalid account number format
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/user/login')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.text).toContain('Invalid account number format.'); // Updated assertion
    });

    it('should return 400 if user not found', async () => {
      const user = {
        username: 'nonexistentuser',
        accountNumber: '1234567890',
        password: 'password123',
      };

      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/user/login')
        .send(user);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid credentials. User not found.'); // Updated assertion
    });
  });
});