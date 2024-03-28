import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'

const app = fastify()
const port = 3333

app.get('/hello', async () => {
  const transaction = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Transação Completa',
      amount: 1000,
    })
    .returning('*')
  return transaction
})

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`Server is running on port ${port}`)
  })
