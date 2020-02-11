const bcrypt = require('bcryptjs')

function makeUsersArray() {
  return [
    {
      id: 1,
      first_name: 'test-user-1',
      last_name: 'Test user 1',
      email: 'user@test.com',
      user_name: 'TU1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_modified: null
  },
  {
      id: 2,
      first_name: 'test-user-2',
      last_name: 'Test user 2',
      email: 'user2@test.com',
      user_name: 'TU2',
      password: 'password2',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_modified: null
      },
      {
      id: 3,
      first_name: 'test-user-3',
      last_name: 'Test user 3',
      email: 'user3@test.com',
      user_name: 'TU3',
      password: 'password3',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_modified: null
      }
  ]
}

function makeGamesArray(){
  return [
    {

      game_name: 'TestGame1',
      game_date: '2020-02-04T23:00:00.000Z',
      game_time: '20:00:00',
      game_street: '8 Dutrow Ct.', 
      game_city: 'Clarksburg',
      game_state: 'MD',
      game_zip: '20871',
      game_lat: '39.0712654',
      game_lng: '-77.1527529',
      created_by: 1
  },
  {

    game_name: 'TestGame2',
    game_date: '2020-02-04 23:00:00',
    game_time: '20:00:00',
    game_street: '9 Dutrow Ct.', 
    game_city: 'Clarksburg',
    game_state: 'MD',
    game_zip: '20871',
    game_lat: '39.0712654',
    game_lng: '-77.1527529',
    created_by: 2

},
{
    game_name: 'TestGame3',
    game_date: '2020-02-04 23:00:00',
    game_time: '20:00:00',
    game_street: '12 Dutrow Ct.', 
    game_city: 'Clarksburg',
    game_state: 'MD',
    game_zip: '20871',
    game_lat: '39.0712654',
    game_lng: '-77.1527529',
    created_by: 3
}
  ]
}

function makeCommentsArray() {
  return [
    {
      id: 1,
      user_id: 2,
      user_name: 'TU2',
      comment: 'testcomment1',
      game_id: 2,
      date_created: '2029-01-22T16:28:32.615Z',
      date_modified: null
  },
  {
      id: 2,
      user_id: 1,
      user_name: 'TU1',
      comment: 'testcomment2',
      game_id: 2,
      date_created: '2029-01-22T16:28:32.615Z',
      date_modified: null
  },
  {
      id: 3,
      user_id: 3,
      user_name: 'TU3',
      comment: 'testcomment',
      game_id: 2,
      date_created: '2029-01-22T16:28:32.615Z',
      date_modified: null
  },
  ]
}

function makeExpectedArticle(users, article, comments=[]) {
  const author = users
    .find(user => user.id === article.author_id)

  const number_of_comments = comments
    .filter(comment => comment.article_id === article.id)
    .length

  return {
    id: article.id,
    style: article.style,
    title: article.title,
    content: article.content,
    date_created: article.date_created.toISOString(),
    number_of_comments,
    author: {
      id: author.id,
      user_name: author.user_name,
      full_name: author.full_name,
      nickname: author.nickname,
      date_created: author.date_created.toISOString(),
      date_modified: author.date_modified || null,
    },
  }
}

function makeExpectedArticleComments(users, articleId, comments) {
  const expectedComments = comments
    .filter(comment => comment.article_id === articleId)

  return expectedComments.map(comment => {
    const commentUser = users.find(user => user.id === comment.user_id)
    return {
      id: comment.id,
      text: comment.text,
      date_created: comment.date_created.toISOString(),
      user: {
        id: commentUser.id,
        user_name: commentUser.user_name,
        full_name: commentUser.full_name,
        nickname: commentUser.nickname,
        date_created: commentUser.date_created.toISOString(),
        date_modified: commentUser.date_modified || null,
      }
    }
  })
}

function makeMaliciousArticle(user) {
  const maliciousArticle = {
    id: 911,
    style: 'How-to',
    date_created: new Date(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    author_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedArticle = {
    ...makeExpectedArticle([user], maliciousArticle),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousArticle,
    expectedArticle,
  }
}

// function makeArticlesFixtures() {
//   const testUsers = makeUsersArray()
//   const testArticles = makeArticlesArray(testUsers)
//   const testComments = makeCommentsArray(testUsers, testArticles)
//   return { testUsers, testArticles, testComments }
// }

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        postup_users,
        postup_games,
        postup_comments,
        postup_games_attendance
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE postup_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE postup_games_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE postup_comments_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('postup_users_id_seq', 0)`),
        trx.raw(`SELECT setval('postup_games_id_seq', 0)`),
        trx.raw(`SELECT setval('postup_comments_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users){ 
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  
  return db.into('postup_users').insert(preppedUsers)
    .then(()=> 
      db.raw(
        `SELECT setval('postup_users_id_seq', ?)`,
        [users[users.length-1].id]
      )
    )
}

function seedGames(db, games){ 
  return db.into('postup_games').insert(games)
}

function seedComments(db, comments){ 
  return db.into('postup_comments').insert(comments)
}


function seedArticlesTables(db, users, articles, comments=[]) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('blogful_articles').insert(articles)

    await trx.raw(
      `SELECT setval('blogful_articles_id_seq', ?)`,
      [articles[articles.length - 1].id],
    )
  })
}

function seedMaliciousArticle(db, user, article) {
    return seedUsers(db, [user])
      .then(() =>
        db
          .into('blogful_articles')
          .insert([article])
      )
}

module.exports = {
  makeUsersArray,
  makeGamesArray,
  makeExpectedArticle,
  makeExpectedArticleComments,
  makeMaliciousArticle,
  makeCommentsArray,
  cleanTables,
  seedGames,
  seedMaliciousArticle,
  seedUsers,
  seedComments
}
