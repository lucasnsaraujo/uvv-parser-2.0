import express from "express";
import "express-async-errors";
import routes from "./routes.js";
import { crawler } from "./scripts/crawler.js";

const app = express();

app.use(express.json());
//app.use(routes);

let PORT;
const { CURRENT_ENV } = process.env;
if (["production", "development"].includes(CURRENT_ENV)) {
  PORT = process.env.PORT;
} else {
  PORT = 1234;
}

app.listen(PORT, () => {
  console.log(`🔥 Running on port ${PORT} in ${CURRENT_ENV ?? "localhost"}`);
});

const localLogin = {
  login: "202088349",
  password: "03100123",
};

await crawler(localLogin);
