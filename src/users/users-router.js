const express = require('express')

const usersRouter = express.Router()
const jsonBodyParser = express.json()
const UsersService = require('./users-service')


usersRouter
    .post('/api/users', jsonBodyParser, (req, res, next) => {

        const { first_name, last_name, email, user_name, password } = req.body

        
        UsersService.userNameIsUnique(req.app.get('db'), user_name)
            .then(userNameIsUnique => {
                if (!userNameIsUnique){
                    res.status(400).json({ error: 'Username already taken'})
                }

                if (userNameIsUnique){
                    return UsersService.hashPassword(password)
                        .then(hashedPW => {

                            const updatedUser = {
                                first_name,
                                last_name,
                                email,
                                user_name,
                                password: hashedPW
                            }

                            return UsersService.insertUser(req.app.get('db'), updatedUser)
                                .then( user => {
                                    res
                                        .status(201)
                                        .json(user)
                                })
                                .catch(next)
                        })
                }
            })
    })



module.exports = usersRouter
