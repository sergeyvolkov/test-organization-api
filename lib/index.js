'use strict';

const Boom = require('boom');
const Config = require('config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-jwt2');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Good = require('good');
const Vision = require('vision');

const DbPlugin = require('./db');
const JWTPlugin = require('./methods/jwt');

const Pkg = require('./../package');

async function compose() {
  const server = Hapi.server({
    port: process.env.PORT || 80,
    routes: {
      cors: true,
      validate: {
        failAction: async (request, h, err) => {
          // eslint-disable-next-line no-console
          console.log(err);
          if (process.env.NODE_ENV === 'production') {
            throw Boom.badRequest('Invalid request payload input');
          } else {
            // eslint-disable-next-line no-console
            console.error(err);
            throw err;
          }
        },
      },
    },
  });

  await server.register(DbPlugin);

  await server.register(HapiAuth);
  await server.register({
    plugin: JWTPlugin,
    options: {
      jwtSecretKey: Config.jwt.secretKey,
      jwtRefreshKey: Config.jwt.refreshKey,
      jwtPublicKey: Config.jwt.publicKey,
    },
  });
  server.auth.default('jwt:access');

  await server.register({
    plugin: Good,
    options: {
      ops: {
        interval: 60000, // 1 minute
      },
      reporters: {
        consoleReporter: [
          {
            module: 'good-console',
          },
          'stdout',
        ],
      },
    },
  });

  if (Config.swagger.enabled) {
    await await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: `${Pkg.name} API Documentation`,
            version: Pkg.version,
          },
          securityDefinitions: {
            jwt: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header',
            },
          },
        },
      },
    ]);
  }

  /* METHODS */
  server.bind(server.methods);

  /* MODELS */
  server.schwifty(require('./db/models/organization'));

  /* SERVER ROUTES */
  // organization CRUD
  server.route(require('./routes/organization/create'));
  server.route(require('./routes/organization/delete'));
  server.route(require('./routes/organization/details'));
  server.route(require('./routes/organization/listing'));
  server.route(require('./routes/organization/update'));

  // auth
  server.route(require('./routes/auth/sign-in'));

  return server;
}

compose()
  .then(async server => {
    await server.start();

    await server.knex().migrate.latest();

    if (Config.db.runSeeds) {
      await server.knex().seed.run();
    }
  }).catch(error => {
    /* eslint-disable-next-line */
    console.error(error);
    /* eslint-disable-next-line */
    process.exit(1);
  });

module.exports = {
  compose,
};
