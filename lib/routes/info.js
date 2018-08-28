'use strict';

const Config = require('config');
const Joi = require('joi');
const Pkg = require('./../../package');

module.exports = {
  path: '/',
  method: 'GET',
  options: {
    description: 'API info',
    tags: ['api'],
    auth: false,
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        title: Joi.string(),
        description: Joi.string(),
        version: Joi.string(),
        docsUrl: Joi.string().optional(),
      },
    },
  },
  handler: async function (request) {
    const {
      name: title,
      description,
      version,
    } = Pkg;

    const response = {
      title,
      description,
      version,
    };

    if (Config.swagger.enabled) {
      response.docsUrl = `${request.server.info.uri}/documentation`;
    }

    return response;
  },
};
