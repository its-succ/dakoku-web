const request = require('supertest');  // eslint-disable-line node/no-unpublished-require
const Emulator = require('google-datastore-emulator');  // eslint-disable-line node/no-unpublished-require
const express = require('express');
const bodyParser = require('body-parser');
const register = require('./register');
const app = express();
app.use(bodyParser.json());
app.use(register);

const verify = require('./token-verifier');
jest.mock('./token-verifier');

const successBody = {
  cardNumber: '1234567890123456',
  password: 'password'
};

const emulator = new Emulator();

beforeAll(() => {
  return emulator.start();
}, 60000);

afterAll(() => {
  return emulator.stop();
});

test('トークンが不正な場合は403エラーを返すこと', () => {
  verify.mockImplementation(async () => null);
  return request(app).post("/").send(successBody).then(response => {
    expect(response.statusCode).toBe(403);
  })
});

test('トークンのドメインが不正な場合は403エラーを返すこと', () => {
  verify.mockImplementation(async () => { return { hd: 'gmail.com' }; });
  return request(app).post("/").send(successBody).then(response => {
    expect(response.statusCode).toBe(403);
  })
});

test.each`
  cardNumber            | password      | desc
  ${""}                 | ${"1234567"}  | ${"カード番号が空"}
  ${"123"}              | ${"1234567"}  | ${"カード番号が16桁でない"}
  ${"123456789a123456"} | ${"1234567"}  | ${"カード番号が16桁だが数字以外が含まれている"}
  ${"1234567890123456"} | ${""}         | ${"パスワードが空"}
`('$descによってバリデーションエラーの場合は400エラーを返すこと', ({cardNumber, password}) => {
  verify.mockImplementation(async () => { return { hd: 'esm.co.jp', email: 'hoge@esm.co.jp' }; });
  return request(app).post("/").send({cardNumber, password}).then(response => {
    expect(response.statusCode).toBe(400);
  })
});

test('値が正しいときは登録が成功して201が戻ること', () => {
  verify.mockImplementation(async () => { return { hd: 'esm.co.jp', email: 'hoge@esm.co.jp' }; });
  return request(app).post("/").send(successBody).then(response => {
    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBe(successBody.cardNumber);
    expect(response.body.email).toBe('hoge@esm.co.jp');
    expect(response.body.password).toBeDefined();
    expect(response.body.createdOn).toBeDefined();
    expect(response.body.modifiedOn).toBeDefined();
  })
});

test('値が重複しているときは409エラーを返すこと', async () => {
  verify.mockImplementation(async () => { return { hd: 'esm.co.jp', email: 'hoge@esm.co.jp' }; });
  await request(app).post("/").send(successBody);
  const response = await request(app).post("/").send(successBody);
  expect(response.statusCode).toBe(409);
});
