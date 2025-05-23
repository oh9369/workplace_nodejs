const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
  await sequelize.sync();
});

describe('POST /join', () => {
  test('로그인 안 했으면 가입', (done) => {
    request(app)
      .post('/auth/join')
      .send({
        email: 'example@example.com',
        nick: 'example',
        password: 'examplePassword',
      })
      .expect('Location', '/')
      .expect(302, done);
  });
});

describe('POST /join', () => {
  const agent = request.agent(app);
  beforeEach((done) => { // 각각의 테스트 실행에 앞서 먼저 실행되는 부분
    agent
      .post('/auth/login')
      .send({
        email: 'example@example.com',
        password: 'examplePassword',
      })
      .end(done);
  });

  test('이미 로그인했으면 redirect /', (done) => {
    const message = encodeURIComponent('로그인한 상태입니다.');
    agent
      .post('/auth/join')
      .send({
        email: 'example@example.com',
        nick: 'example',
        password: 'examplePassword',
      })
      .expect('Location', `/?error=${message}`)
      .expect(302, done);
  });
});

describe('POST /login', () => {
  test('가입되지 않은 회원', (done) => {
    const message = encodeURIComponent('가입되지 않은 회원입니다.');
    request(app)
      .post('/auth/login')
      .send({
        email: 'wrong@example.com',
        password: 'examplePassword',
      })
      .expect('Location', `/?error=${message}`)
      .expect(302, done);
  });

  test('로그인 수행', (done) => {
    request(app)
      .post('/auth/login')
      .send({
        email: 'example@example.com',
        password: 'examplePassword',
      })
      .expect('Location', '/')
      .expect(302, done);
  });

  test('비밀번호 틀림', (done) => {
    const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
    request(app)
      .post('/auth/login')
      .send({
        email: 'example@example.com',
        password: 'wrong',
      })
      .expect('Location', `/?error=${message}`)
      .expect(302, done);
  });
});

describe('GET /logout', () => {
  test('로그인 되어있지 않으면 403', (done) => {
    request(app)
      .get('/auth/logout')
      .expect(403, done);
  });

  const agent = request.agent(app);
  beforeEach((done) => {
    agent
      .post('/auth/login')
      .send({
        email: 'example@example.com',
        password: 'examplePassword',
      })
      .end(done);
  });

  test('로그아웃 수행', (done) => {
    agent
      .get('/auth/logout')
      .expect('Location', `/`)
      .expect(302, done);
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
});