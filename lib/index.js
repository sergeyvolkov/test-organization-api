'use strict';

const Boom = require('boom');
const Hapi = require('hapi');

async function compose() {
  return Hapi.server({
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
