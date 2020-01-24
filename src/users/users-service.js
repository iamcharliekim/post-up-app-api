const bcrypt = require('bcryptjs')

const UsersService = {
    userNameIsUnique(db, user_name){
        return db('postup_users')
            .where({user_name})
            .first()
            .then(user => {
                console.log(user)
                return !user
            })
    },

    hashPassword(password){
        return bcrypt.hash(password, 12)   
    },

    insertUser(db, user){
        return db('postup_users')
            .insert(user)
            .returning('*')
            .then(([user]) => {
                console.log(user)
                return user
            })
    }

}

module.exports = UsersService