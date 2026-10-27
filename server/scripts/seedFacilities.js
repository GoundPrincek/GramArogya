const { seedDatabase } = require('./seedData');

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
