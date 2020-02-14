const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Games Endpoints', function() {
  let db
  let token;
  const testUsers  =  helpers.makeUsersArray()
  const testGames  =  helpers.makeGamesArray()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
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

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST /api/games', ()=> {
    const testGame = {
      game_name: 'TestGame4',
      game_date: '2020-02-04T23:00:00.000Z',
      game_time: '20:00:00',
      game_street: '12 Dutrow Ct.', 
      game_city: 'Clarksburg',
      game_state: 'MD',
      game_zip: '20871',
      game_lat: '39.0712654',
      game_lng: '-77.1527529',
  }

    it(`responds with 201 when all fields are valid`, ()=> {
        return supertest(app)
            .post('/api/games')
            .set({ 'Authorization':`Bearer ${token}`})
            .send(testGame)
            .then(res => {
                const game = res.body[0];
                expect(game.game_name).to.eql(testGame.game_name)
                expect(game.game_date).to.eql(testGame.game_date)
                expect(game.game_time).to.eql(testGame.game_time)
                expect(game.game_street).to.eql(testGame.game_street)
                expect(game.game_city).to.eql(testGame.game_city)
                expect(game.game_state).to.eql(testGame.game_state)
                expect(game.game_zip).to.eql(testGame.game_zip)
                expect(game.game_lat).to.eql(testGame.game_lat)
                expect(game.game_lng).to.eql(testGame.game_lng)
            })                
    })
  })

    it(`responds with 201 when all fields are valid`, ()=> {
      const testGame = testGames[0]

        return supertest(app)
            .get('/api/games')
            .set({ 'Authorization':`Bearer ${token}`})
            .then(res => {
              let game1 = res.body.games[0]
              expect(game1.created_by).to.eql(testGame.created_by)
              expect(game1.game_name).to.eql(testGame.game_name)
              expect(game1.game_date).to.eql(testGame.game_date)
              expect(game1.game_time).to.eql(testGame.game_time)
              expect(game1.game_street).to.eql(testGame.game_street)
              expect(game1.game_city).to.eql(testGame.game_city)
              expect(game1.game_state).to.eql(testGame.game_state)
              expect(game1.game_zip).to.eql(testGame.game_zip)
              expect(game1.game_lat).to.eql(testGame.game_lat)
              expect(game1.game_lng).to.eql(testGame.game_lng)
              expect(res.body.user_id).to.eql(testUsers[0].id)         
            })                
    })

  describe('PUT /api/games/:game_id', ()=> {
    const game_id = 1
    const updatedGame = {
        created_by: 1,
        game_name: 'TestGame1 - updated',
        game_date: '2020-02-04T23:00:00.000Z',
        game_time: '20:00:00',
        game_street: '8 New St.',
        game_city: 'Clarksburg',
        game_state: 'MD',
        game_zip: '20871',
        game_lat: '39.0712654',
        game_lng: '-77.1527529'
    }
  
    it(`responds with 201 when all fields are valid`, ()=> {
        return supertest(app)
            .put(`/api/games/${game_id}`)
            .set({ 'Authorization':`Bearer ${token}`})
            .send(updatedGame)
            .then(res => {
              const game = res.body
              expect(game.created_by).to.eql(updatedGame.created_by)
              expect(game.game_name).to.eql(updatedGame.game_name)
              expect(game.game_date).to.eql(updatedGame.game_date)
              expect(game.game_time).to.eql(updatedGame.game_time)
              expect(game.game_street).to.eql(updatedGame.game_street)
              expect(game.game_city).to.eql(updatedGame.game_city)
              expect(game.game_state).to.eql(updatedGame.game_state)
              expect(game.game_zip).to.eql(updatedGame.game_zip)
              expect(game.game_lat).to.eql(updatedGame.game_lat)
              expect(game.game_lng).to.eql(updatedGame.game_lng)
            })                
    })
  })

  describe('DELETE /api/games/:game_id', ()=> {
    const game_id = 1

    it(`responds with 200 when all fields are valid`, ()=> {
        return supertest(app)
            .delete(`/api/games/${game_id}`)
            .set({ 'Authorization':`Bearer ${token}`})
            .expect(200)          
    })
  })

  describe('GET /api/games/mygames', ()=> {
    const user_id = 1
    const expectedGame = testGames.filter(game => game.created_by === user_id)[0]

    it(`responds with 200 when all fields are valid`, ()=> {
        return supertest(app)
            .get(`/api/games/mygames`)
            .set({ 'Authorization':`Bearer ${token}`})
            .then(res => {
              const myGames = res.body

              myGames.forEach(game => {
                expect(game.game_name).to.eql(expectedGame.game_name)
                expect(game.game_date).to.eql(expectedGame.game_date)
                expect(game.game_time).to.eql(expectedGame.game_time)
                expect(game.game_street).to.eql(expectedGame.game_street)
                expect(game.game_city).to.eql(expectedGame.game_city)
                expect(game.game_state).to.eql(expectedGame.game_state)
                expect(game.game_zip).to.eql(expectedGame.game_zip)
                expect(game.game_lat).to.eql(expectedGame.game_lat)
                expect(game.game_lng).to.eql(expectedGame.game_lng)
              })
            })
          })
  })

  describe('POST /api/games/attendance', ()=> {
    const game_id = 1

    it(`responds with 201 when all fields are valid`, ()=> {
        return supertest(app)
            .post(`/api/games/attendance`)
            .set({ 'Authorization':`Bearer ${token}`})
            .send({game_id})
            .expect(201, {username: 'TU1', id: 1})
    })
  })

  describe('GET api/games/attendance/:game_id', ()=> {
    const game_id = 2

    it(`responds with 200 when all fields are valid`, ()=> {
      return supertest(app)
        .get(`/api/games/attendance/${game_id}`)
        .set({ 'Authorization':`Bearer ${token}`})
        .expect(200, {user_id: 1, attendance:[]})
      })
  })

  describe('DELETE api/games/attendance/:game_id', ()=> {
    const game_id = 1 

    it(`responds with 200 when all fields are valid`, () => {
      return supertest(app)
        .delete(`/api/games/attendance/${game_id}`)
        .set({ 'Authorization':`Bearer ${token}`})
        .expect(200, { username: 'TU1', id: 1 })

    })
  })

  describe('GET api/games/attendance/rsvp/:game_id', ()=> {
    const game_id = 1 

    it(`responds with 200 when all fields are valid`, () => {
      return supertest(app)
        .get(`/api/games/attendance/rsvp/${game_id}`)
        .set({ 'Authorization':`Bearer ${token}`})
        .expect(200, {})
    })
  })
})

