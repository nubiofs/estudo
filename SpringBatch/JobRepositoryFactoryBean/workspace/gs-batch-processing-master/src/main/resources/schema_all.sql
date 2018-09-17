CREATE USER test;

ALTER USER test WITH PASSWORD 'passwd';

CREATE DATABASE testdb;

GRANT ALL PRIVILEGES ON DATABASE testdb TO test;

DROP TABLE IF EXISTS public.people;

CREATE TABLE public.people  (
   	id Bigserial PRIMARY KEY NOT NULL,
    first_name VARCHAR(20),
   	last_name VARCHAR(20)
);

ALTER TABLE "public"."people" OWNER TO test;
