'use strict';

const Boom = require('boom');
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Good = require('good');
const Vision = require('vision');

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

  server.register({
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

  if (process.env.SWAGGER_ENABLED) {
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: `${Pkg.name} API Documentation`,
            version: Pkg.version,
          },
        },
      },
    ]);
  }

  /* SERVER ROUTES */
  // organization CRUD
  server.route(require('./routes/organization/details'));
  server.route(require('./routes/organization/listing'));

  return server;
}

compose()
  .then(async server => {
    await server.start();
  }).catch(error => {
    /* eslint-disable-next-line */
    console.error(error);
    /* eslint-disable-next-line */
    process.exit(1);
  });

module.exports = {
  compose,
};
