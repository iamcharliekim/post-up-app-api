CREATE TABLE postup_users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    user_name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    date_modified TIMESTAMP
);
