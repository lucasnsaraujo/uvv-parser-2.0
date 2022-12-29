CREATE DATABASE uvv;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS posts (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id BIGINT,
  post_url VARCHAR,
  title VARCHAR,
  subject VARCHAR,
  subject_url VARCHAR,
  teacher VARCHAR,
  comments jsonb
);