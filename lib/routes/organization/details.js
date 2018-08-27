'use strict';

const Joi = require('joi');

module.exports = {
  path: '/organization/{organizationId}',
  method: 'GET',
  options: {
    description: 'Get organization details',
    tags: ['api'],
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
  handler: async function (request) {
    const { Organization } = request.models();

    return await Organization
      .query()
      .findOne({
        id: request.params.organizationId,
      })
      .throwIfNotFound();
  },
};
