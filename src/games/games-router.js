const express = require('express')

const gamesRouter = express.Router()
const jsonBodyParser = express.json()
const GamesService = require('./games-service')
const {requireAuth} = require('../middleware/basic-auth')

gamesRouter
    .route('/api/games')
    .post(requireAuth, jsonBodyParser, (req, res, next)=> {
        const { game_name, game_date, game_time, game_street, game_city, game_state, game_zip, game_lat, game_lng } = req.body
        const newGame = { game_name, game_date, game_time, game_street, game_city, game_state, game_zip, game_lat, game_lng }
        
        newGame.created_by = req.user.id

        GamesService.insertGame(req.app.get('db'),newGame)
            .then(games => {
                res.json(games)
            })

    })
    .get((req, res, next)=> {
        GamesService.getGames(req.app.get('db'))
            .then(games => {
                res.json(games)

            })
            .catch(next)
    })

gamesRouter
    .route('/api/games/mygames')
    .get(requireAuth, (req, res, next)=> {
        const userId = req.user.id
        
        GamesService.getGamesByUserId(req.app.get('db'), userId)
            .then(games => {
                res.json(games)
            })
            .catch(next)
    })


gamesRouter
    .route('/api/games/attendance')
    .post(requireAuth, jsonBodyParser, (req, res, next)=> { 
        const {game_id} = req.body
        const attending_user = req.user.id

        const rsvpObj = { game_id, attending_user }

        // check to see if attending_user already exists in game
        GamesService.isUserAlreadyAttending(req.app.get('db'), rsvpObj.game_id, rsvpObj.attending_user)
            .then(userIsAlreadyAttending => {
                if(userIsAlreadyAttending){
                    return 
                } else {
                    // if user is not already attending, increment game, get count
                    GamesService.incrementGameRsvp(req.app.get('db'), rsvpObj)
                        .then(rsvp => {
                            GamesService.gameAttendanceCounter(req.app.get('db'), rsvpObj.game_id)
                                .then(rsvpCount => {
                                    res.send(rsvpCount.count)
                                })                            
                        })
                }
            })
            .catch(next)
    })


gamesRouter
    .route('/api/games/attendance/:game_id')
    .get(requireAuth, (req, res, next)=> {
        const game_id = req.params.game_id
        const user_id = req.user.id

        GamesService.getGameAttendance(req.app.get('db'), game_id)
            .then(attendance => {
                let isUserAttending = attendance.filter(game => game.attending_user === user_id)[0]
                let userAttendance;

                if (isUserAttending){
                    userAttendance = true 
                } else {
                    userAttendance = false
                }

                res.json(userAttendance)
            })        
    })
    .delete(requireAuth, (req, res, next)=> {
        const attending_user = req.user.id
        const game_id = req.params.game_id

        GamesService.deleteGameAttendance(req.app.get('db'), game_id, attending_user)
            .then(game => {
                GamesService.gameAttendanceCounter(req.app.get('db'), game_id)
                .then(rsvpCount => {
                    res.send(rsvpCount.count)
                })                         
            })
            .catch(next)
    })

gamesRouter
    .route('/api/games/attendance/rsvp/:game_id')
    .get(requireAuth, (req, res, next)=> {
        const game_id = req.params.game_id
        GamesService.gameAttendanceCounter(req.app.get('db'), game_id)
            .then(rsvpCount => {
                res.send(rsvpCount.count)
            })
            .catch(next)
    })


module.exports = gamesRouter
    