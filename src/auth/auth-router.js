const express = require('express')

const authRouter = express.Router()
const jsonBodyParser = express.json()

const AuthService = require('./auth-service')

authRouter  
    .post('/api/auth/login', jsonBodyParser, (req, res, next) => {
        const {user_name, password} = req.body
        const loginUser = { user_name, password }

        for (const [key, value] of Object.entries(loginUser)){
            if (value == null){
                return res.status(400).json({
                    error: `Missing ${key} in request body`
                })
            }
        }

        AuthService.getUserWithUserName(req.app.get('db'), loginUser.user_name)
            .then(dbUser => {

                // IF THERE IS NO MATCH
                if(!dbUser){
                    return res.status(400).json({
                        error: 'Incorrect user_name or password'
                    })
                }

                // IF THERE IS A MATCH, COMPARE PW'S
                return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(compareMatch => {
                        // IF THERE IS NO MATCH
                        if (!compareMatch){
                            return res.status(400).json({
                                error: 'Incorrect user_name or password'
                            })
                        }

                        // IF THERE IS A MATCH, CREATE JWT AND SEND AS RESPONSE
                        const subject = dbUser.user_name
                        const payload = { user_id: dbUser.id }

                        const paySub = AuthService.veryifyJwt(AuthService.createJWT(subject, payload))

                        res.send({
                            authToken: AuthService.createJWT(subject, payload),
                                
                        })
                    })
            })
            .catch(next)
    })

module.exports = authRouter