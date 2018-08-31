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

describe('Listing organization API', () => {
  let server;

  const defaultCredentials = {
    id: 1,
  };

  const listingOrganizationRequest = async (options) => {
    return await server.inject({
      url: '/organization',
      method: 'GET',
      ...options,
    });
  };

  before(async () => {
    server = await Server.compose();
  });

  it('should fails without token', async () => {
    const response = await listingOrganizationRequest();
    expect(response.statusCode).to.be.equal(401);
    expect(response.result.error).to.be.equal('Unauthorized');
  });

  it('should successfully returns listing', async () => {
    const response = await listingOrganizationRequest({
      credentials: defaultCredentials,
    });
    expect(response.statusCode).to.be.equal(200);
    expect(response.result).to.be.an.object().and.include(['items']);
    expect(response.result.items).to.be.an.array();
  });

  after(async () => {
    if (!server) {
      return;
    }

    await server.stop();
    server = null;
  });
});
