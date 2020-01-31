const express = require('express')

const commentsRouter = express.Router()
const jsonBodyParser = express.json()
const CommentsService = require('./comments-service')
const {requireAuth} = require('../middleware/basic-auth')
const UsersService = require('../users/users-service')

commentsRouter
    .route('/api/games/comments')
    .get((req, res, next)=> {
        CommentsService.getComments(req.app.get('db'))
            .then(comment => {
                console.log('$$//getCOMMENTS()', comment)
                res.json(comment)
            })
            .catch(next)
    })
    .post(requireAuth, jsonBodyParser, (req, res, next)=> {
        const commentObj = req.body
        const user_id = req.user.id

        commentObj.user_id = user_id
        
        UsersService.getUserById(req.app.get('db'), commentObj.user_id)
            .then(user => {
                console.log(user.user_name)

                commentObj.user_name = user.user_name


                CommentsService.insertComment(req.app.get('db'), commentObj)
                    .then(comment => {
                        console.log(comment)

                        res.json(comment[0])
                    
                    })
                })
                .catch(next)
    })

module.exports = commentsRouter