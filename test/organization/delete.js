'use strict';

const Code = require('code');
const Lab = require('lab');

const Server = require('../../lib/index');

const { expect } = Code;
const {
  after,
  before,
  describe,
  it,
} = module.exports.lab = Lab.script();

const {
  requests: {
    create: createRequest,
    delete: deleteRequest,
  },
  payload: {
    createRequired: createRequiredPayload,
  },
  credentials,
  randomOrganizationId,
} = require('./../helpers/requests');

describe('Delete organization API', () => {
  let server;

  before(async () => {
    server = await Server.compose();
  });

  it('should fails without token', async () => {
    const response = await deleteRequest(server, randomOrganizationId);
    expect(response.statusCode).to.be.equal(401);
    expect(response.result.error).to.be.equal('Unauthorized');
  });

  it('should successfully deletes organization', async () => {
    const createResponse = await createRequest(server, {
      payload: createRequiredPayload,
      credentials,
    });

    const response = await deleteRequest(server, createResponse.result.id, {
      credentials,
    });
    expect(response.statusCode).to.be.equal(204);
    expect(response.result).to.be.a.null();
  });

  it('should returns an error for non-existent organization', async () => {
    const createResponse = await createRequest(server, {
      payload: createRequiredPayload,
      credentials,
    });

    await deleteRequest(server, createResponse.result.id, {
      credentials,
    });

    const failureResponse = await deleteRequest(server, createResponse.result.id, {
      credentials,
    });
    expect(failureResponse.statusCode).to.be.equal(404);
  });

  after(async () => {
    if (!server) {
      return;
    }

    await server.stop();
    server = null;
  });
});
