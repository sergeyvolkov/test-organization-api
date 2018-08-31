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

describe('Details organization API', () => {
  let server;

  const randomOrganizationId = 42;

  const defaultCredentials = {
    id: 1,
  };

  const createOrganizationRequest = async (options) => {
    return await server.inject({
      url: '/organization',
      method: 'POST',
      ...options,
    });
  };

  const detailsOrganizationRequest = async (id, options) => {
    return await server.inject({
      url: `/organization/${id}`,
      method: 'GET',
      ...options,
    });
  };

  const deleteOrganizationRequest = async (id, options) => {
    return await server.inject({
      url: `/organization/${id}`,
      method: 'DELETE',
      ...options,
    });
  };

  before(async () => {
    server = await Server.compose();
  });

  it('should fails without token', async () => {
    const response = await detailsOrganizationRequest(randomOrganizationId);
    expect(response.statusCode).to.be.equal(401);
    expect(response.result.error).to.be.equal('Unauthorized');
  });

  it('should successfully returns details', async () => {
    const defaultCreatePayload = {
      name: 'organization-1',
      description: 'description-1',
      url: 'url-1',
      code: 'code-1',
      type: 'employer',
    };

    const createResponse = await createOrganizationRequest({
      payload: defaultCreatePayload,
      credentials: defaultCredentials,
    });

    const response = await detailsOrganizationRequest(createResponse.result.id, {
      credentials: defaultCredentials,
    });
    expect(response.statusCode).to.be.equal(200);
    expect(response.result).to.be.an.object().and.include(['id', 'name', 'description', 'url', 'code', 'type']);

    expect(response.result.name).to.be.equal(defaultCreatePayload.name);
    expect(response.result.description).to.be.equal(defaultCreatePayload.description);
    expect(response.result.url).to.be.equal(defaultCreatePayload.url);
    expect(response.result.code).to.be.equal(defaultCreatePayload.code);
    expect(response.result.type).to.be.equal(defaultCreatePayload.type);
  });

  it('should returns an error for non-existent organization', async () => {
    const createResponse = await createOrganizationRequest({
      payload: {
        name: 'test-organization',
      },
      credentials: defaultCredentials,
    });

    await deleteOrganizationRequest(createResponse.result.id, {
      credentials: defaultCredentials,
    });

    const failureResponse = await detailsOrganizationRequest(createResponse.result.id, {
      credentials: defaultCredentials,
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
