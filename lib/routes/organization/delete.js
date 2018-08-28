'use strict';

const Joi = require('joi');

module.exports = {
  path: '/organization/{organizationId}',
  method: 'DELETE',
  options: {
    description: 'Delete an organization',
    tags: ['api'],
    auth: 'jwt:access',
    validate: {
      params: {
        organizationId: Joi.number().integer().positive().label('Organization ID'),
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
      .delete()
      .findOne({
        id: request.params.organizationId,
      })
      .throwIfNotFound();

    return h
      .response();
  },
};
