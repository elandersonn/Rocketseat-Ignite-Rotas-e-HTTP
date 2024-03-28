import { knex as setupKnex } from 'knex'

export const config = {
  client: 'better-sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './tmp/app.db',
  },
}

export const knex = setupKnex(config)
