require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require ('helmet')
const { NODE_ENV } = require('./config')
const app = express();
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common'
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')
const gamesRouter = require('./games/games-router')
const commentsRouter = require('./comments/comments-router')

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(authRouter)
app.use(usersRouter)
app.use(gamesRouter)
app.use(commentsRouter)

app.use(function errorHandler(error, req, res, next){
    let response
    if (NODE_ENV === 'production'){
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app 