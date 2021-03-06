'use strict';

const Joi = require('joi');
const { raw } = require('objection');

module.exports = {
  path: '/organization',
  method: 'GET',
  options: {
    description: 'Get all organizations',
    tags: ['api'],
    auth: 'jwt:access',
    validate: {
      query: {
        name: Joi.string(),
      },
    },
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        items: Joi.array().items({
          id: Joi.number(),
          name: Joi.string(),
          description: Joi.string(),
          url: Joi.string(),
          code: Joi.string(),
          type: Joi.any().valid('employer', 'insurance', 'health system'),
        }),
      },
    },
  },
  handler: async function (request) {
    const { Organization } = request.models();

    const items = Organization
      .query()
      .orderBy('id');

    if (request.query.name) {
      items
        .where(raw('lower("name")'), 'like', `%${request.query.name}%`);
    }

    return {
      items: await items,
    };
  },
};
