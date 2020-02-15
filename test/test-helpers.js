const bcrypt = require("bcryptjs");

function makeUsersArray() {
  return [
    {
      id: 1,
      first_name: "test-user-1",
      last_name: "Test user 1",
      email: "user@test.com",
      user_name: "TU1",
      password: "password",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      date_modified: null,
    },
    {
      id: 2,
      first_name: "test-user-2",
      last_name: "Test user 2",
      email: "user2@test.com",
      user_name: "TU2",
      password: "password2",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      date_modified: null,
    },
    {
      id: 3,
      first_name: "test-user-3",
      last_name: "Test user 3",
      email: "user3@test.com",
      user_name: "TU3",
      password: "password3",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
      date_modified: null,
    },
  ];
}

function makeGamesArray() {
  return [
    {
      game_name: "TestGame1",
      game_date: "2020-02-04T23:00:00.000Z",
      game_time: "20:00:00",
      game_street: "8 Dutrow Ct.",
      game_city: "Clarksburg",
      game_state: "MD",
      game_zip: "20871",
      game_lat: "39.0712654",
      game_lng: "-77.1527529",
      created_by: 1,
    },
    {
      game_name: "TestGame2",
      game_date: "2020-02-04 23:00:00",
      game_time: "20:00:00",
      game_street: "9 Dutrow Ct.",
      game_city: "Clarksburg",
      game_state: "MD",
      game_zip: "20871",
      game_lat: "39.0712654",
      game_lng: "-77.1527529",
      created_by: 2,
    },
    {
      game_name: "TestGame3",
      game_date: "2020-02-04 23:00:00",
      game_time: "20:00:00",
      game_street: "12 Dutrow Ct.",
      game_city: "Clarksburg",
      game_state: "MD",
      game_zip: "20871",
      game_lat: "39.0712654",
      game_lng: "-77.1527529",
      created_by: 3,
    },
  ];
}

function makeCommentsArray() {
  return [
    {
      id: 1,
      user_id: 2,
      user_name: "TU2",
      comment: "testcomment1",
      game_id: 2,
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null,
    },
    {
      id: 2,
      user_id: 1,
      user_name: "TU1",
      comment: "testcomment2",
      game_id: 2,
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null,
    },
    {
      id: 3,
      user_id: 3,
      user_name: "TU3",
      comment: "testcomment",
      game_id: 2,
      date_created: "2029-01-22T16:28:32.615Z",
      date_modified: null,
    },
  ];
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx
      .raw(
        `TRUNCATE
        postup_users,
        postup_games,
        postup_comments,
        postup_games_attendance
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE postup_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE postup_games_id_seq minvalue 0 START WITH 1`),
          trx.raw(
            `ALTER SEQUENCE postup_comments_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(`SELECT setval('postup_users_id_seq', 0)`),
          trx.raw(`SELECT setval('postup_games_id_seq', 0)`),
          trx.raw(`SELECT setval('postup_comments_id_seq', 0)`),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));

  return db
    .into("postup_users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('postup_users_id_seq', ?)`, [
        users[users.length - 1].id,
      ])
    );
}

function seedGames(db, games) {
  return db.into("postup_games").insert(games);
}

function seedComments(db, comments) {
  return db.into("postup_comments").insert(comments);
}

module.exports = {
  makeUsersArray,
  makeGamesArray,
  makeCommentsArray,
  cleanTables,
  seedGames,
  seedUsers,
  seedComments,
};
