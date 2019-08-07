const request = require('supertest');  // eslint-disable-line node/no-unpublished-require
const Emulator = require('google-datastore-emulator');  // eslint-disable-line node/no-unpublished-require
const express = require('express');
const bodyParser = require('body-parser');

const router = require('express-promise-router')();
const User = require('../../model/user');
const verify = require('../token-verifier');
jest.mock('../token-verifier');

const delete = require('./delete');
const app = express();
app.use(bodyParser.json());

delete({router, User, verify});
app.use(router);

const successCard = '123456789a123456';

const emulator = new Emulator();

beforeAll(() => {
  return emulator.start();
}, 60000);

afterAll(() => {
  return emulator.stop();
});

test('トークンが不正な場合は403エラーを返すこと', () => {
  verify.mockImplementation(async () => null);
  return request(app).del(`/${successCard}`).then(response => {
    expect(response.statusCode).toBe(403);
  })
});

test('トークンのドメインが不正な場合は403エラーを返すこと', () => {
  verify.mockImplementation(async () => { return { hd: 'gmail.com' }; });
  return request(app).del(`/${successCard}`).then(response => {
    expect(response.statusCode).toBe(403);
  })
});

test('カード番号が指定されていない場合は400エラーを返すこと', () => {
  verify.mockImplementation(async () => { return { hd: 'gmail.com' }; });
  return request(app).del("/").then(response => {
    expect(response.statusCode).toBe(400);
  })
});

test('値が正しいときは削除が成功して200が戻ること', () => {
  verify.mockImplementation(async () => { return { hd: 'esm.co.jp', email: 'hoge@esm.co.jp' }; });
  return request(app).del(`/${successCard}`).then(response => {
    expect(response.statusCode).toBe(200);
  })
});
