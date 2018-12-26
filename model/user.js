const Datastore = require('@google-cloud/datastore');
const gstore = require('gstore-node')();
const crypto = require('crypto');
const { Schema } = gstore;

const datastore = new Datastore();
gstore.connect(datastore);

const userSchema = new Schema({
  idm: { type: String, required: true },
  email: { type: String, validate: 'isEmail', required: true },
  password: { type: String, read: false, required: true },
  createdOn: { type: Date, default: gstore.defaultValues.NOW, write: false },
  modifiedOn: { type: Date, write: false },
});

function hashPassword() {
  const key = "abcdefghijklmnopqrstuvwx";

  const encrypt = crypto.createCipheriv('des-ede3', key, "");
  let theCipher = encrypt.update(this.password, 'utf8', 'base64');
  theCipher += encrypt.final('base64');
  this.password = theCipher;

  return Promise.resolve();
}

userSchema.pre('save', hashPassword);

module.exports = gstore.model('User', userSchema);
