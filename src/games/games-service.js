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

    deleteGameAttendance(db, game_id, attending_user){
        return db('postup_games_attendance')
            .where({game_id})
            .where({attending_user})
            .del()
    },

    gameAttendanceCounter(db, game_id){
        return db('postup_games_attendance')
            .count('*')
            .where({game_id})
            .returning('*')
            .first()
    },

    getGameAttendance(db, game_id){
        return db('postup_games_attendance')
            .where({game_id})
            .returning('*')
    },

    isUserAlreadyAttending(db, game_id, attending_user){
        return db('postup_games_attendance')
            .select('*')
            .where({game_id})
            .then(attendance => {
                let userAttending = attendance.filter(game => game.attending_user === attending_user)
                if (userAttending.length > 0){
                    return true
                } else {
                    return false
                }
                
            })
    }
    



}

module.exports = GamesService