-- Table: public.experience

-- DROP TABLE public.experience;

CREATE TABLE public.experience
(
  id bigint NOT NULL,
  name character varying(255) DEFAULT NULL::character varying,
  country character varying(100) DEFAULT NULL::character varying,
  birthdate character varying(255),
  company character varying(255),
  depto character varying(255) DEFAULT NULL::character varying,
  CONSTRAINT experience_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.experience
  OWNER TO "user";
