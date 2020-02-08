const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
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

  afterEach('cleanup', () => helpers.cleanTables(db))


    describe.only('POST /api/auth/login', ()=> {
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers,
            )
        )

        const userLogin = {
            user_name: 'TU1',
            password: 'password'
        }

        it('returns an authToken if all fields are correct', ()=> {
            
            return supertest(app)
                .post('/api/auth/login')
                .send(userLogin)
                .then(res => console.log(res.body))


        })

    
    
    })
})
