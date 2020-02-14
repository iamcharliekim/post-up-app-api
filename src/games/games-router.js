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
            .catch(next)
    })
    
    .get(requireAuth, (req, res, next)=> {
        const user_id = req.user.id
        
        GamesService.getGames(req.app.get('db'))
            .then(games => {
                let response = {
                    games,
                    user_id
                }
                res.json(response)
            })
            .catch(next)
    })

gamesRouter
    .route('/api/games/:game_id')    
    .put(requireAuth, jsonBodyParser, (req, res, next)=> {
        const updatedGame = req.body
        const game_id = +req.params.game_id

        GamesService.updateGame(req.app.get('db'), updatedGame, game_id)
            .then(games => {
                res.json(games[0])
            })
            .catch(next)
    })
    .delete(requireAuth, (req, res, next)=> {
        const game_id = +req.params.game_id

        GamesService.deleteGame(req.app.get('db'), game_id)
            .then(games => {
                res.send('game deleted!')
            })
    })

gamesRouter
    .route('/api/games/mygames')
    .get(requireAuth, (req, res, next)=> {
        const userId = req.user.id
        
        GamesService.getGamesByUserId(req.app.get('db'), userId)
            .then(games => {
                res.status(200).json(games)
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
                    res.send('User is already attending!') 
                } else {
                    // if user is not already attending, increment game, get count
                    GamesService.incrementGameRsvp(req.app.get('db'), rsvpObj)
                        .then(rsvp => {
                            GamesService.getUsernames(req.app.get('db'), +req.user.id)
                                .then(user => {
                                    res.json(201, {
                                        username: user.user_name,
                                        id: +user.id
                                    })                        
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
                res.json({
                    user_id,
                    attendance: attendance
                })
            })        
    })
    .delete(requireAuth, (req, res, next)=> {
        const attending_user = req.user.id
        const game_id = req.params.game_id

        GamesService.deleteGameAttendance(req.app.get('db'), game_id, attending_user)
            .then(game => {
                GamesService.gameAttendanceCounter(req.app.get('db'), game_id)
                .then(rsvpCount => {
                    GamesService.getUsernames(req.app.get('db'), +req.user.id)
                    .then(user => {
                        res.json({
                            username: user.user_name,
                            id: +user.id
                        })                        
                    })
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
    