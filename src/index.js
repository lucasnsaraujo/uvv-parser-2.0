import express from "express";
import "express-async-errors";
import routes from "./routes.js";
import { crawler } from "./scripts/crawler.js";

const app = express();

app.use(express.json());
app.use(routes);

let PORT;
const { CURRENT_ENV } = process.env;
if (["production", "development"].includes(CURRENT_ENV)) {
  PORT = process.env.PORT;
} else {
  PORT = 1234;
}

const localLogin = null;

const credentials = ["production", "development"].includes(CURRENT_ENV)
  ? { login: process.env.USER_LOGIN, password: process.env.USER_PASSWORD }
  : localLogin;

app.listen(PORT, async () => {
  console.log(`🔥 Running on port ${PORT} in ${CURRENT_ENV ?? "localhost"}`);
  await crawler(credentials);
});
