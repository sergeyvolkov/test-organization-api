'use strict';

const Joi = require('joi');

module.exports = {
  path: '/auth/sign-in',
  method: 'POST',
  options: {
    description: 'Sign in with login/password',
    tags: ['api'],
    auth: false,
    validate: {
      payload: {
        username: Joi.string().required().description('Username'),
        password: Joi.string().required().description('Password'),
      },
    },
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        access: Joi.object({
          token: Joi.string(),
          expiresAt: Joi.date(),
        }),
        refresh: Joi.object({
          token: Joi.string(),
          expiresAt: Joi.date(),
        }),
      },
    },
  },
  handler: async function () {
    const credentials = {
      id: 1,
    };

    const {
      token: accessToken,
      expiresAt: accessExpiresAt,
    } = await this.jwt.generateAccessToken(credentials);
    const {
      token: refreshToken,
      expiresAt: refreshExpiresAt,
    } = await this.jwt.generateRefreshToken(credentials);

    return {
      access: {
        token: accessToken,
        expiresAt: accessExpiresAt,
      },
      refresh: {
        token: refreshToken,
        expiresAt: refreshExpiresAt,
      },
    };
  },
};
