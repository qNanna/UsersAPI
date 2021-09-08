import { knex } from 'knex';

import config from '../config/index';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: config.sqlitePath,
  },
  useNullAsDefault: false,
});

export default db;
