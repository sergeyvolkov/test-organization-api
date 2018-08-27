'use strict';

const Joi = require('joi');

module.exports = {
  path: '/organization/{organizationId}',
  method: 'GET',
  options: {
    description: 'Get organization details',
    auth: false,
    validate: {
      params: {
        organizationId: Joi.number().integer().positive().label('Organization ID'),
      },
    },
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        id: Joi.number(),
        name: Joi.string(),
        description: Joi.string(),
        url: Joi.string(),
        code: Joi.string(),
        type: Joi.any().valid('employer', 'insurance', 'health system'),
      },
    },
  },
  handler: function () {
    return {};
  },
};