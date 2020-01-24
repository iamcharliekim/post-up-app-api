CREATE TABLE postup_games (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    created_by INTEGER REFERENCES postup_users(id) ON DELETE SET NULL,
    game_name TEXT NOT NULL,
    game_date TIMESTAMP NOT NULL,
    game_time TIME NOT NULL,
    game_address TEXT NOT NULL
);