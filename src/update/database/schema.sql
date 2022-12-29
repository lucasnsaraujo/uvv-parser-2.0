CREATE DATABASE uvv;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS teachers (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS subjects (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  teacher_id UUID NOT NULL,
  FOREIGN KEY(teacher_id) REFERENCES teachers(id)
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  post_number VARCHAR NOT NULL UNIQUE,
  subject_id UUID NOT NULL,
  teacher_id UUID NOT NULL,
  title VARCHAR,
  content VARCHAR,
  comments UUID[],
  FOREIGN KEY(subject_id) REFERENCES subjects(id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID NOT NULL,
  creator_id UUID NOT NULL,
  content VARCHAR,
  FOREIGN KEY(creator_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);