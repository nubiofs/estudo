/*
DROP TABLE IF EXISTS public.people;

CREATE TABLE public.people  (
   	id Bigserial PRIMARY KEY NOT NULL,
    first_name VARCHAR(20),
   	last_name VARCHAR(20)
);

ALTER TABLE "public"."people" OWNER TO test;
*/

DROP TABLE people IF EXISTS;

CREATE TABLE people  (
    id BIGINT IDENTITY NOT NULL PRIMARY KEY,
    first_name VARCHAR(20),
    last_name VARCHAR(20)
);
