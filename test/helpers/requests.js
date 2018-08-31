'use strict';

const createOrganizationRequest = async (server, options) => await server.inject({
  url: '/organization',
  method: 'POST',
  ...options,
});

const deleteOrganizationRequest = async (server, id, options) => await server.inject({
  url: `/organization/${id}`,
  method: 'DELETE',
  ...options,
});

const detailsOrganizationRequest = async (server, id, options) => await server.inject({
  url: `/organization/${id}`,
  method: 'GET',
  ...options,
});

const listingOrganizationRequest = async (server, options) => await server.inject({
  url: '/organization',
  method: 'GET',
  ...options,
});

const updateOrganizationRequest = async (server, id, options) => await server.inject({
  url: `/organization/${id}`,
  method: 'PUT',
  ...options,
});

const signInRequest = async (server, options) => await server.inject({
  url: '/auth/sign-in',
  method: 'POST',
  ...options,
});

const fullCreatePayload = {
  name: 'test-name',
  description: 'test-description',
  url: 'test-url',
  code: 'test-code',
  type: 'employer',
};
const requiredCreatePayload = {
  name: 'test-name-short',
};

const fullUpdatePayload = {
  name: 'update-name',
  description: 'update-description',
  url: 'update-url',
  code: 'update-code',
  type: 'insurance',
};
const requiredUpdatePayload = {
  name: 'update-name-short',
};

const signInPayload = {
  username: 'foo',
  password: 'bar',
};

const defaultCredentials = {
  id: 1,
};

module.exports = {
  requests: {
    create: createOrganizationRequest,
    delete: deleteOrganizationRequest,
    details: detailsOrganizationRequest,
    listing: listingOrganizationRequest,
    update: updateOrganizationRequest,
    signIn: signInRequest,
  },
  payload: {
    create: fullCreatePayload,
    createRequired: requiredCreatePayload,
    signIn: signInPayload,
    update: fullUpdatePayload,
    updateRequired: requiredUpdatePayload,
  },
  credentials: defaultCredentials,
  randomOrganizationId: 42,
};
