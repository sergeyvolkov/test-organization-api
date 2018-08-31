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
  },
  payload: {
    create: createPayload,
    createRequired: createRequiredPayload,
  },
  credentials,
} = require('./../helpers/requests');

describe('Create organization API', () => {
  let server;

  before(async () => {
    server = await Server.compose();
  });

  it('should fails without token', async () => {
    const response = await createRequest(server);
    expect(response.statusCode).to.be.equal(401);
    expect(response.result.error).to.be.equal('Unauthorized');
  });

  it('should fails without name', async () => {
    const payload = Object.assign({}, createPayload);
    delete payload.name;

    const response = await createRequest(server, {
      payload,
      credentials,
    });
    expect(response.statusCode).to.be.equal(400);
    expect(response.result.error).to.be.equal('Bad Request');
  });

  it('should successfully create an organization', async () => {
    const response = await createRequest(server, {
      payload: createPayload,
      credentials,
    });
    expect(response.statusCode).to.be.equal(201);
    expect(response.result).to.be.an.object().and.include(['id']);
  });

  it('should successfully create an organization only with name', async () => {
    const response = await createRequest(server, {
      payload: createRequiredPayload,
      credentials,
    });
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
