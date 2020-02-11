const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Comments Endpoints', function() {
  let db
  let token;

  const testUsers  =  helpers.makeUsersArray()

  const testGames  =  helpers.makeGamesArray()

const testComments = helpers.makeCommentsArray()


  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  before((done) => {
    supertest(app)
      .post('/api/users')
      .send({
          first_name:'test',
          last_name:'test',
          email:'test@test.com',
          user_name: 'testuser',
          password: 'testuser',
      })
      .then(user=>{
        supertest(app)
        .post('/api/auth/login')
        .send({
          user_name: 'testuser',
          password: 'testuser',
        })
        .end((err, response) => {
          token = response.body.authToken; // save the token!
          done();
        });
      })
  });

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  beforeEach('insert users', () =>
    helpers.seedUsers(
      db,
      testUsers,
    )
  )    

  beforeEach('insert games', () =>
    helpers.seedGames(
        db,
        testGames,
    )
  )

  beforeEach('insert comments', () =>
    helpers.seedComments(
        db,
        testComments,
    )
  )

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('GET /api/games/comments', ()=> {
    it(`responds with 200 when all fields are valid`, ()=> {
        return supertest(app)
            .get('/api/games/comments')
            .set({ 'Authorization':`Bearer ${token}`})
            .expect(200, testComments)
        })
    })

  describe('POST /api/games/comments', ()=> {
    const testComment =    {
        id: 4,
        user_id: 1,
        user_name: 'TU1',
        comment: 'testcomment4',
        game_id: 2,
        date_created: '2029-01-22T16:28:32.615Z',
        date_modified: null
    }

    it(`responds with 201 when all fields are valid`, ()=> {
        return supertest(app)
            .post('/api/games/comments')
            .set({ 'Authorization':`Bearer ${token}`})
            .send(testComment)
            .expect(201, testComment)
        })
    })
})
