import { knex } from 'knex';

import config from '../config/index';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: config.sqlitePath,
  },
  useNullAsDefault: false,
});

db.migrate.latest().then(
  ([, log]) => console.info(!log.length ? 'Database migrated' : 'Ran migrations: \n' + log.join('\n')),
  err => console.error(err)
);

export default db;
