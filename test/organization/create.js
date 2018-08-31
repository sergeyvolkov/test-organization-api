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

describe('Create organization API', () => {
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

  const createOrganizationRequest = async (options) => {
    return await server.inject({
      url: '/organization',
      method: 'POST',
      ...options,
    });
  };

  before(async () => {
    server = await Server.compose();
  });

  it('should fails without token', async () => {
    const response = await createOrganizationRequest();
    expect(response.statusCode).to.be.equal(401);
    expect(response.result.error).to.be.equal('Unauthorized');
  });

  it('should fails without name', async () => {
    const payload = Object.assign({}, defaultPayload);
    delete payload.name;

    const response = await createOrganizationRequest({ payload, credentials: defaultCredentials });
    expect(response.statusCode).to.be.equal(400);
    expect(response.result.error).to.be.equal('Bad Request');
  });

  it('should successfully create an organization', async () => {
    const payload = Object.assign({}, defaultPayload);

    const response = await createOrganizationRequest({ payload, credentials: defaultCredentials });
    expect(response.statusCode).to.be.equal(201);
    expect(response.result).to.be.an.object().and.include(['id']);
  });

  it('should successfully create an organization only with name', async () => {
    const payload = Object.assign({}, {
      name: defaultPayload.name,
    });

    const response = await createOrganizationRequest({ payload, credentials: defaultCredentials });
    expect(response.statusCode).to.be.equal(201);
    expect(response.result).to.be.an.object().and.include(['id']);
  });

  after(async () => {
    if (!server) {
      return;
    }

    await server.stop();
    server = null;
  });
});
