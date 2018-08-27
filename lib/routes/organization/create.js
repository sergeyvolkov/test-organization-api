'use strict';

const Joi = require('joi');

module.exports = {
  path: '/organization',
  method: 'POST',
  options: {
    description: 'Create an organization',
    tags: ['api'],
    validate: {
      payload: {
        name: Joi.string(),
        description: Joi.string(),
        url: Joi.string(),
        code: Joi.string(),
        type: Joi.any().valid('employer', 'insurance', 'health system'),
      },
    },
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        id: Joi.number(),
      },
    },
  },
  handler: async function (request, h) {
    const { Organization } = request.models();

    const organization = await Organization
      .query()
      .insertAndFetch(request.payload);

    return h
      .response(organization)
      .created(`/organization/${organization.id}`);
  },
};