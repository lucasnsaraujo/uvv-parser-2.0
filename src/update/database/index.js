import pg from "pg";

const { Client } = pg;

const { CURRENT_ENV } = process.env;

// Change according to development docker information
const DEVELOPMENT_POSTGRES_CONFIG = {
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "uvv",
};

const isDeployed = !!["production", "development"].includes(CURRENT_ENV);

const POSTGRES_CONFIG = isDeployed
  ? {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    }
  : DEVELOPMENT_POSTGRES_CONFIG;

const client = new Client(POSTGRES_CONFIG);

client.connect();

const query = async (query) => {
  const { rows } = await client.query(query);
  return rows;
};

const db = { query };
export default db;
