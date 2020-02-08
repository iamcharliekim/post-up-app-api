const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Comments Endpoints', function() {
  let db
  let token;

  const testUsers  =  [
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

  const testGames  =  [
      {
          id: 1,
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
        id: 2,
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
        id: 3,
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

const testComments = [
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
