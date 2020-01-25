const express = require('express')

const gamesRouter = express.Router()
const jsonBodyParser = express.json()
const GamesService = require('./games-service')
const {requireAuth} = require('../middleware/basic-auth')

gamesRouter
    .route('/api/games')
    .post(requireAuth, jsonBodyParser, (req, res, next)=> {
        console.log('POST GAME /api/games - req.user', req.user)

        const { game_name, game_date, game_time, game_address } = req.body
        const newGame = { game_name, game_date, game_time, game_address }
        
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
        
        res.json(req.body)
        next()
        // const { game_name, game_date, game_time, game_address } = req.body
        // const newGame = { game_name, game_date, game_time, game_address }
        
        // newGame.created_by = req.user.id

        // GamesService.insertGame(req.app.get('db'),newGame)
        //     .then(games => {
        //         res.json(games)
        //     })

    })

module.exports = gamesRouter
    