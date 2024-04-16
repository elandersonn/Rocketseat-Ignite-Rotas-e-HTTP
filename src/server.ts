import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { knex } from './database';
import crypto from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const app = fastify();
const port = 3333;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/',
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const hash = crypto.createHash('sha256');
  hash.update(password);
  const encryptedPassword = hash.digest('hex');

  const userData = await knex('users')
    .insert({
      id: crypto.randomUUID(),
      username: username,
      password: password,
      encrypted_password: encryptedPassword
    })
    .returning('*');

  return userData
});

app.get('/users', async () => {
  const users = await knex('users').select('*');
  return users
});

app.delete('/users', async () => {
  const users = await knex('users').delete('*')
  return users
})

app.listen({ port })
  .then(() => console.log(`Server is running on port ${port}`));
