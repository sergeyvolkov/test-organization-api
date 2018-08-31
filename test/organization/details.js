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
    details: detailsRequest,
  },
  payload: {
    create: createPayload,
    createRequired: createRequiredPayload,
  },
  credentials,
  randomOrganizationId,
} = require('./../helpers/requests');

describe('Details organization API', () => {
  let server;

  before(async () => {
    server = await Server.compose();
  });

  it('should fails without token', async () => {
    const response = await detailsRequest(server, randomOrganizationId);
    expect(response.statusCode).to.be.equal(401);
    expect(response.result.error).to.be.equal('Unauthorized');
  });

  it('should successfully returns details', async () => {
    const createResponse = await createRequest(server, {
      payload: createPayload,
      credentials,
    });

    const response = await detailsRequest(server, createResponse.result.id, {
      credentials,
    });
    expect(response.statusCode).to.be.equal(200);
    expect(response.result).to.be.an.object().and.include(['id', 'name', 'description', 'url', 'code', 'type']);

    expect(response.result.name).to.be.equal(createPayload.name);
    expect(response.result.description).to.be.equal(createPayload.description);
    expect(response.result.url).to.be.equal(createPayload.url);
    expect(response.result.code).to.be.equal(createPayload.code);
    expect(response.result.type).to.be.equal(createPayload.type);
  });

  it('should returns an error for non-existent organization', async () => {
    const createResponse = await createRequest(server, {
      payload: createRequiredPayload,
      credentials,
    });

    await deleteRequest(server, createResponse.result.id, {
      credentials,
    });

    const failureResponse = await detailsRequest(server, createResponse.result.id, {
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
