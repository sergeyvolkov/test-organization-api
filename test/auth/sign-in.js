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

describe('Sign-in API', () => {
  let server;

  const defaultPayload = {
    username: 'foo',
    password: 'bar',
  };

  const signInRequest = async (options) => {
    return await server.inject({
      url: '/auth/sign-in',
      method: 'POST',
      ...options,
    });
  };

  before(async () => {
    server = await Server.compose();
  });

  it('should fails without payload', async () => {
    const response = await signInRequest();
    expect(response.statusCode).to.be.equal(400);
    expect(response.result.error).to.be.equal('Bad Request');
  });

  it('should successfully sign in user', async () => {
    const response = await signInRequest({
      payload: defaultPayload,
    });
    expect(response.statusCode).to.be.equal(200);
    expect(response.result).to.be.an.object().and.include(['access', 'refresh']);

    expect(response.result.access).to.be.an.object().and.include(['token', 'expiresAt']);
    expect(response.result.refresh).to.be.an.object().and.include(['token', 'expiresAt']);
  });

  after(async () => {
    if (!server) {
      return;
    }

    await server.stop();
    server = null;
  });
});
