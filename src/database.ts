import { knex as setupKnex, Knex } from 'knex'

export const config: Knex.Config = {
  client: 'better-sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './db/users.db',
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  }
}

export const knex = setupKnex(config)
