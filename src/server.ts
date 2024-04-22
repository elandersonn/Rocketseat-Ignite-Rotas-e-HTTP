import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { knex } from "./database";
import crypto from "node:crypto";
import path from "path";
import { fileURLToPath } from "url";

const app = fastify();
const port = 3333;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.register(fastifyStatic, {
  root: path.join(__dirname, "..", "public"),
  prefix: "/",
});

app.post("/user", async (req, res) => {
  const { username, password }: any = req.body;

  const hash = crypto.createHash("sha256");
  hash.update(password);
  const encryptedPassword = hash.digest("hex");

  const userData = await knex("users")
    .insert({
      id: crypto.randomUUID(),
      username: username,
      password: password,
      encrypted_password: encryptedPassword,
    })
    .returning("*");
  console.log("Created User: ", JSON.stringify(userData));

  return userData;
});

app.post("/login", async (req, res) => {
  const { username, password }: any = req.body;
  if (!username || !password) {
    return res.code(400).send({ message: "Missing username or password" });
  }

  const hash = crypto.createHash("sha256");
  hash.update(password);
  const encryptedPassword = hash.digest("hex");

  console.log(username, password, encryptedPassword)
  const user = await knex("users")
    .where("username", username)
    .andWhere("encrypted_password", encryptedPassword)
    .first();

  if (!user) {
    return res.code(404).send({ message: "User not found" });
  }
  return res.code(200).send({ message: "Login successful" });
});

app.post("/password-reset", async (req, res) => {
  const { id, username }: any = req.body;
  if (!id || !username) {
    return res.code(400).send({ message: "Missing username or password" });
  }
  const user = await knex("users")
    .where("id", id)
    .andWhere("username", username)
    .first();

  if (!user) {
    return res.code(404).send({ message: "User not found" });
  }

  const newPassword = "12345aA!";
  const hash = crypto.createHash("sha256");
  hash.update(newPassword);
  const encryptedPassword = hash.digest("hex");

  await knex("users").where("id", id).update({
    password: newPassword,
    encrypted_password: encryptedPassword
  });

  res.send({ message: "Password reset successfully" });
});

app.get("/users", async () => {
  const users = await knex("users").select("*");
  return users;
});

app.delete("/users", async () => {
  const users = await knex("users").delete("*");
  return users;
});

app.post("/check-captcha", async (req, res) => {
  const { captchaText, captchaInput }: any = req.body;
  const isValid = captchaInput ? captchaInput === captchaText : false;
  return isValid;
});

app
  .listen({ port })
  .then(() => console.log(`Server is running on port ${port}`));
