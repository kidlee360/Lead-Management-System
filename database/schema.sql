-- Table: public.leads

-- DROP TABLE IF EXISTS public.leads;

CREATE TABLE IF NOT EXISTS leads
(
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    client_name character varying COLLATE pg_catalog."default",
    deal_description character varying COLLATE pg_catalog."default",
    deal_value numeric(10,2),
    column_name character varying COLLATE pg_catalog."default",
    column_entry_time timestamp without time zone,
    last_activity_at timestamp without time zone,
    lead_source character varying COLLATE pg_catalog."default",
    user_id integer,
    CONSTRAINT leads_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS leads
    OWNER to postgres;




-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY NOT NULL UNIQUE,
    user_name character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default",
    role character varying COLLATE pg_catalog."default",
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS users
    OWNER to postgres;