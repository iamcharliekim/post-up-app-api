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

    incrementGameRsvp(db, rsvpObj){
        return db('postup_games_attendance')
            .insert(rsvpObj)
            .returning('*')
    },

    gameAttendanceCounter(db, gameId){
        return db('postup_games_attendance')
            .count('*')
            .where({game_id: gameId})
            .returning('*')
            .first()
    }
    



}

module.exports = GamesService