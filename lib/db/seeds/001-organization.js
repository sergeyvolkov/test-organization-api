'use strict';

const faker = require('faker');

const generateRandomType = () => {
  const randomIndex = Math.floor(Math.random() * 3);

  const types = ['employer', 'insurance', 'health system'];

  return types[randomIndex];
};

const generateRandomOrganization = () => ({
  name: faker.company.companyName(),
  description: faker.lorem.text(),
  url: faker.internet.url(),
  code: faker.company.bsNoun(),
  type: generateRandomType(),
});

module.exports.seed = async knex => {
  const organizationsList = Array(10)
    .fill(null)
    .map(generateRandomOrganization);

  await knex('organization').insert(organizationsList);
};
