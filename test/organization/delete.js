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

describe('Delete organization API', () => {
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
    const response = await deleteOrganizationRequest(randomOrganizationId);
    expect(response.statusCode).to.be.equal(401);
    expect(response.result.error).to.be.equal('Unauthorized');
  });

  it('should successfully deletes organization', async () => {
    const createResponse = await createOrganizationRequest({
      payload: {
        name: 'test-organization',
      },
      credentials: defaultCredentials,
    });

    const response = await deleteOrganizationRequest(createResponse.result.id, {
      credentials: defaultCredentials,
    });
    expect(response.statusCode).to.be.equal(204);
    expect(response.result).to.be.a.null();
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

    const failureResponse = await deleteOrganizationRequest(createResponse.result.id, {
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
