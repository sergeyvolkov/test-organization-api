'use strict';

const Joi = require('joi');

module.exports = {
  path: '/organization',
  method: 'GET',
  options: {
    description: 'Get all organizations',
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
  handler: function () {
    return {
      items: [],
    };
  },
};