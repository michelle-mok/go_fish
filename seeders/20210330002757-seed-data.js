const jsSHA = require('jssha');
const faker = require('faker');

module.exports = {
  up: async (queryInterface) => {
    const userPassword = 'qwerty';
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update(userPassword);
    const hashedPassword = shaObj.getHash('HEX');

    const usersList = [];

    for (let i = 0; i < 10; i += 1) {
      usersList.push({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        password: hashedPassword,
        availability: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('users', usersList, { returning: true });
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
