const GamesService = {
    getGames(db){
        return db('postup_games')
            .returning('*')
    },

    getGamesByUserId(db, userId){
        return db('postup_games')
        .returning('*')
        .where({ created_by: userId})
            

    },
    
    insertGame(db, game){
        return db('postup_games')
            .insert(game)
            .returning('*') 
    },

    incrementGameAttendance(db, gameId){
        return db('postup_games')
            .select(raw("nextval('postup_games_attending_seq'::regclass)"))
            .returning(select('last_value').from('post_up_games_attending_seq'))
            
    }



}

module.exports = GamesService