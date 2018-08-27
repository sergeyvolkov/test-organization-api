'use strict';

module.exports.up = async db => {
  await db.schema.createTable('organization', table => {
    table.increments('id').primary();
    table.string('name', 64).notNullable();
    table.text('description');
    table.string('url');
    table.string('code');
    table.enum('type', ['employer', 'insurance', 'health system']).defaultTo('employer').notNullable();

    table.timestamps(true, true);
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('organization');
};
