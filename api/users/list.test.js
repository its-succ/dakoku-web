const request = require('supertest');  // eslint-disable-line node/no-unpublished-require
const Emulator = require('google-datastore-emulator');  // eslint-disable-line node/no-unpublished-require
const express = require('express');
const bodyParser = require('body-parser');

const router = require('express-promise-router')();
const User = require('../../model/user');
const verify = require('../token-verifier');
jest.mock('../token-verifier');

const list = require('./list');
const app = express();
app.use(bodyParser.json());

list({router, User, verify});
app.use(router);

const successBody = [ '1234567890123456', '987654321012345' ];

const emulator = new Emulator();

beforeAll(async () => {
  await emulator.start();
  const user1 = new User({
    email: 'test@example.com',
    password: 'password'
  }, '1234567890123456');
  await user1.save();
  const user2 = new User({
    email: 'test@example.com',
    password: 'password'
  }, '987654321012345');
  await user2.save();
}, 60000);

afterAll(() => {
  return emulator.stop();
});

test('トークンが不正な場合は403エラーを返すこと', () => {
  verify.mockImplementation(async () => null);
  return request(app).get("/").then(response => {
    expect(response.statusCode).toBe(403);
  })
});

test('トークンのドメインが不正な場合は403エラーを返すこと', () => {
  verify.mockImplementation(async () => { return { hd: 'gmail.com' }; });
  return request(app).get("/").then(response => {
    expect(response.statusCode).toBe(403);
  })
});

test('トークンが正しいときは一覧取得が成功して200が戻ること', () => {
  verify.mockImplementation(async () => { return { hd: 'esm.co.jp', email: 'test@example.com' }; });
  return request(app).get("/").then(response => {
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(successBody);
  })
});
