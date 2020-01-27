const express = require('express')

const gamesRouter = express.Router()
const jsonBodyParser = express.json()
const GamesService = require('./games-service')
const {requireAuth} = require('../middleware/basic-auth')

gamesRouter
    .route('/api/games')
    .post(requireAuth, jsonBodyParser, (req, res, next)=> {
        console.log('POST GAME /api/games - req.user', req.user)

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
                console.log(games)
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

        const rsvpObj = {
            game_id,
            attending_user
        }

        console.log('rsvpObj', rsvpObj)

        GamesService.incrementGameRsvp(req.app.get('db'), rsvpObj)
            .then(rsvp => {
                console.log('RSVP:', rsvp)
                GamesService.gameAttendanceCounter(req.app.get('db'), rsvpObj.game_id)
                    .then(rsvpCount => {
                        console.log('RSVP COUNT', rsvpCount.count)
                        res.send(rsvpCount.count)
                    })
                
            })
            .catch(next)
        

    })

module.exports = gamesRouter
    