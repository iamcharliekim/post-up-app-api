const GamesService = {
    getGames(db){
        return db('postup_games')
            .returning('*')
    },
    
    insertGame(db, game){
        return db('postup_games')
            .insert(game)
            .returning('*')
            
    }



}

module.exports = GamesService