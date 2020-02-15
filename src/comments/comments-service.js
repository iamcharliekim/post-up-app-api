const CommentsService = {
  getComments(db) {
    return db("postup_comments").returning("*");
  },

  insertComment(db, comment) {
    return db("postup_comments")
      .where({ game_id: comment.game_id })
      .insert(comment)
      .returning("*");
  },
};

module.exports = CommentsService;
