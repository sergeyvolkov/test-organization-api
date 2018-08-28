'use strict';

const Boom = require('boom');
const { Model } = require('schwifty');

class Organization extends Model {
  static get tableName() {
    return 'organization';
  }

  static createNotFoundError() {
    return Boom.notFound();
  }
}

module.exports = Organization;
