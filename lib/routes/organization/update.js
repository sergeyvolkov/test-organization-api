'use strict';

const Joi = require('joi');

module.exports = {
  path: '/organization/{organizationId}',
  method: 'PUT',
  options: {
    description: 'Update an organization',
    tags: ['api'],
    validate: {
      params: {
        organizationId: Joi.number().integer().positive().label('Organization ID'),
      },
      payload: {
        name: Joi.string(),
        description: Joi.string(),
        url: Joi.string(),
        code: Joi.string(),
        type: Joi.any().valid('employer', 'insurance', 'health system'),
      },
    },
    response: {
      emptyStatusCode: 204,
      schema: false,
    },
  },
  handler: async function (request, h) {
    const { Organization } = request.models();

    await Organization
      .query()
      .update(request.payload)
      .findOne({
        id: request.params.organizationId,
      })
      .throwIfNotFound();

    return h
      .response();
  },
};
