'use strict';

const Hoek = require('hoek');
const JWT = require('jsonwebtoken');
const UUID62 = require('uuid62');

const internals = {};

internals.validateAccessToken = async function (token) {
  return {
    isValid: true,
    credentials: token.data,
  };
};

internals.validateRefreshToken = async function (token) {
  return {
    isValid: true,
    credentials: token.data,
  };
};

internals.generateToken = async function (payload, options = {}) {
  const expiresIn = options.expiresIn || this.expiresIn;
  const expiresAt = new Date((Math.floor(Date.now() / 1000) + expiresIn) * 1000);

  return new Promise((resolve, reject) => {
    const rid = UUID62.v4();

    JWT.sign({
      data: payload,
      rid,
      refresh: this.refresh,
    }, this.secretKey, { expiresIn, algorithm: this.algorithm, issuer: 'organizer-api' }, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve({
        token,
        rid,
        expiresIn,
        expiresAt,
      });
    });
  });
};

module.exports.plugin = {
  name: 'organization-jwt',
  register: async (server, options) => {
    Hoek.assert(options.jwtRefreshKey, 'Option "jwtRefreshKey" is required');
    Hoek.assert(options.jwtPublicKey, 'Option "jwtPublicKey" is required');
    Hoek.assert(options.jwtSecretKey, 'Option "jwtSecretKey" is required');

    server.auth.strategy('jwt:access', 'jwt', {
      key: options.jwtPublicKey,
      validate: internals.validateAccessToken,
      verifyOptions: { algorithms: ['RS256'] },
      bind: server,
    });

    server.auth.strategy('jwt:refresh', 'jwt', {
      key: options.jwtRefreshKey,
      validate: internals.validateRefreshToken,
      verifyOptions: { algorithms: ['HS256'] },
      bind: server,
    });

    server.method('jwt.generateAccessToken', internals.generateToken, {
      bind: {
        expiresIn: 30 * 60, // 30 minute
        secretKey: options.jwtSecretKey,
        algorithm: 'RS256',
      },
    });
    server.method('jwt.generateRefreshToken', internals.generateToken, {
      bind: {
        expiresIn: 30 * 24 * 60 * 60, // 30d
        secretKey: options.jwtRefreshKey,
        refresh: true,
        algorithm: 'HS256',
      },
    });
  },
};
