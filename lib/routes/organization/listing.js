'use strict';

const Joi = require('joi');

module.exports = {
  path: '/organization',
  method: 'GET',
  options: {
    description: 'Get all organizations',
    tags: ['api'],
    auth: false,
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

    const items = await Organization
      .query()
      .orderBy('id');

    return {
      items,
    };
  },
};
