const User = require('./models/User');

const seedData = async () => {
  try {
    await User.deleteMany({}); // Clear existing users
    await User.create({ username: 'testuser', accountNumber: '1234567890' }); // Create a test user
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedData();