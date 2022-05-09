DROP TABLE IF EXISTS me;
CREATE TABLE IF NOT EXISTS me (
    id SERIAL PRIMARY KEY ,
    title VARCHAR (225),
    release_date VARCHAR (225),
    poster_path VARCHAR (225),
    overview VARCHAR (225)
);