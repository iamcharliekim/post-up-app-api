const bcrypt = require("bcryptjs");

const UsersService = {
  userNameIsUnique(db, user_name) {
    return db("postup_users")
      .where({ user_name })
      .first()
      .then(user => {
        user;
        return !user;
      });
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  insertUser(db, user) {
    return db("postup_users")
      .insert(user)
      .returning("*")
      .then(([user]) => {
        user;
        return user;
      });
  },

  getUserById(db, id) {
    return db("postup_users")
      .returning("*")
      .where({ id })
      .then(user => {
        return user[0];
      });
  },
};

module.exports = UsersService;
