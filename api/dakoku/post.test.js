const request = require('supertest');  // eslint-disable-line node/no-unpublished-require
const Emulator = require('google-datastore-emulator');  // eslint-disable-line node/no-unpublished-require
const express = require('express');
const bodyParser = require('body-parser');

const router = require('express-promise-router')();
const User = require('../../model/user');
const dakokuRequest = require('./dakoku-request');
jest.mock('./dakoku-request');

const post = require('./post');
const app = express();
app.use(bodyParser.json());

post({router, User});
app.use(router);

const emulator = new Emulator();

beforeAll(async () => {
  await emulator.start();
  const user = new User({
    email: 'test@example.com',
    password: 'password'
  }, '1234567890123456');
  await user.save();
}, 60000);

beforeEach(() => {
  dakokuRequest.mockReset();
});

afterAll(() => {
  return emulator.stop();
});

test('ヘッダ−に `X-AppEngine-QueueName` が含まれない場合は400エラーを返すこと', () => {
  return request(app).post("/").send({cardNumber: '1234567890123456'}).then(response => {
    expect(response.statusCode).toBe(400);
  })
});

test('ヘッダーに `X-AppEngine-QueueName` があるときはカード番号からユーザーを取得して dakokuRequest を実行し、202が戻ること', async () => {
  dakokuRequest.mockImplementation(async () => { return; });
  const response = await request(app).post("/").send({cardNumber: '1234567890123456'}).set('X-AppEngine-QueueName', 'queuename').expect(202);
  expect(dakokuRequest.mock.calls[0][0].email).toEqual('test@example.com');
  expect(dakokuRequest.mock.calls[0][0].password).toEqual('password');
});

test('カード番号が存在しないときは、dakokuRequestが実行されず、キューがリトライしないように204が戻ること', async () => {
  dakokuRequest.mockImplementation(async () => { return; });
  const response = await request(app).post("/").send({cardNumber: '1234567890123450'}).set('X-AppEngine-QueueName', 'queuename').expect(204);
  expect(dakokuRequest).not.toBeCalled();
});
