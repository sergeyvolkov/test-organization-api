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

describe('Update organization API', () => {
  let server;

  const defaultPayload = {
    name: 'test-name',
    description: 'test-description',
    url: 'test-url',
    code: 'test-code',
    type: 'employer',
  };
  const defaultCredentials = {
    id: 1,
  };

  const randomOrganizationId = 42;

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

  const updateOrganizationRequest = async (id, options) => {
    return await server.inject({
      url: `/organization/${id}`,
      method: 'PUT',
      ...options,
    });
  };

  before(async () => {
    server = await Server.compose();
  });

  it('should fails without token', async () => {
    const response = await updateOrganizationRequest(randomOrganizationId, {
      payload: {
        name: 'updated-name',
      },
    });
    expect(response.statusCode).to.be.equal(401);
    expect(response.result.error).to.be.equal('Unauthorized');
  });

  it('should successfully update an organization', async () => {
    const payload = Object.assign({}, defaultPayload);

    const createResponse = await createOrganizationRequest({ payload, credentials: defaultCredentials });
    expect(createResponse.statusCode).to.equal(201);
    expect(createResponse.result.id).to.be.a.number();

    const updateResponse = await updateOrganizationRequest(createResponse.result.id, {
      payload: {
        name: 'updated-name',
      },
      credentials: defaultCredentials,
    });
    expect(updateResponse.statusCode).to.be.equal(204);
    expect(updateResponse.result).to.be.a.null();
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
