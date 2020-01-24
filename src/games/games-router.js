const express = require('express')

const gamesRouter = express.Router()
const jsonBodyParser = express.json()
const GamesService = require('./games-service')


gamesRouter
    .route('/api/games')
    .post(jsonBodyParser, (req, res, next)=> {
        console.log(req.body)

        const { game_name, game_date, game_time, game_address } = req.body
        const newGame = { game_name, game_date, game_time, game_address }
        console.log(newGame)

        GamesService.insertGame(req.app.get('db'),newGame)
            .then(games => {
                console.log(games)

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



module.exports = gamesRouter
    