const AuthService = require("../auth/auth-service");
const UsersService = require("../users/users-service");

function requireAuth(req, res, next) {
  // get Authorization header
  const authToken = req.get("Authorization");

  // parse and split header
  const userId = AuthService.veryifyJwt(authToken.split(" ")[1]).user_id;

  // get the User Object from DB with userId
  return UsersService.getUserById(req.app.get("db"), userId)
    .then(user => {
      //set the userObject on req.user and next()
      req.user = user;
      next();
      return null;
    })
    .catch(err => {
      next(err);
    });
}

module.exports = {
  requireAuth,
};
