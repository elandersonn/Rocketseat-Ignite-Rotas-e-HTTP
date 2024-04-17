import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { knex } from './database';
import crypto from 'node:crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const app = fastify()
const port = 3333

const hash = crypto.createHash('sha256')

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/',
});

app.post('/user', async (req, res) => {
  const { username, password }: any = req.body;

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

app.get('/user', async (req, res) => {
  const {username, password}: any = req.body
  if (!username || !password) {
    return res.code(400).send({ message: 'Missing username or password' });
  }

  const hash = crypto.createHash('sha256');
  hash.update(password);
  const encryptedPassword = hash.digest('hex');

  const user = await knex('users')
    .where({ username }) 
    .andWhere('encrypted_password', encryptedPassword) 
    .first(); 

  if (!user) {
    return res.code(404).send({ message: 'User not found' });
  }

  return res.code(200)
})

app.get('/users', async () => {
  const users = await knex('users').select('*');
  return users
});

app.delete('/users', async () => {
  const users = await knex('users').delete('*')
  return users
})

app.post('/check-captcha', async (req, res) => {
  const {captchaText, captchaInput}: any = req.body
  const isValid = captchaInput ? captchaInput === captchaText : false

  return isValid
})

app.listen({ port })
  .then(() => console.log(`Server is running on port ${port}`));
