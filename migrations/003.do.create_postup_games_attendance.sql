CREATE TABLE postup_games_attendance (
    game_id INTEGER REFERENCES postup_games(id) ON DELETE SET NULL,
    attending_user INTEGER REFERENCES postup_users(id) ON DELETE SET NULL
);