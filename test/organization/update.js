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
    update: updateRequest,
  },
  payload: {
    create: createPayload,
    updateRequired: updateRequiredPayload,
    update: updatePayload,
  },
  credentials,
  randomOrganizationId,
} = require('./../helpers/requests');

describe('Update organization API', () => {
  let server;

  before(async () => {
    server = await Server.compose();
  });

  it('should fails without token', async () => {
    const response = await updateRequest(server, randomOrganizationId, {
      payload: updateRequiredPayload,
    });
    expect(response.statusCode).to.be.equal(401);
    expect(response.result.error).to.be.equal('Unauthorized');
  });

  it('should successfully update an organization', async () => {
    const createResponse = await createRequest(server, {
      payload: createPayload,
      credentials,
    });
    const organizationId = createResponse.result.id;

    expect(createResponse.statusCode).to.equal(201);
    expect(organizationId).to.be.a.number();

    const updateResponse = await updateRequest(server, organizationId, {
      payload: updatePayload,
      credentials,
    });

    expect(updateResponse.statusCode).to.be.equal(204);
    expect(updateResponse.result).to.be.a.null();

    const detailsResponse = await detailsRequest(server, organizationId, {
      credentials,
    });
    expect(detailsResponse.result.name).to.be.equal(updatePayload.name);
    expect(detailsResponse.result.description).to.be.equal(updatePayload.description);
    expect(detailsResponse.result.url).to.be.equal(updatePayload.url);
    expect(detailsResponse.result.code).to.be.equal(updatePayload.code);
    expect(detailsResponse.result.type).to.be.equal(updatePayload.type);
  });

  it('should returns an error for non-existent organization', async () => {
    const createResponse = await createRequest(server, {
      payload: createPayload,
      credentials,
    });

    await deleteRequest(server, createResponse.result.id, {
      credentials,
    });

    const updateResponse = await updateRequest(server, createResponse.result.id, {
      payload: updatePayload,
      credentials,
    });
    expect(updateResponse.statusCode).to.be.equal(404);
  });

  after(async () => {
    if (!server) {
      return;
    }

    await server.stop();
    server = null;
  });
});
