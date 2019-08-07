const { Datastore } = require('@google-cloud/datastore');
const { Gstore } = require('gstore-node');
const gstore = new Gstore();
const crypto = require('crypto');
const { Schema } = gstore;

const datastore = new Datastore();
gstore.connect(datastore);

const userSchema = new Schema({
  email: { type: String, validate: 'isEmail', required: true },
  password: { type: String, required: true, excludeFromIndexes: true },
  createdOn: { type: Date, default: gstore.defaultValues.NOW, write: false },
  modifiedOn: { type: Date, write: false },
});

function hashPassword() {
  const encrypt = crypto.createCipheriv('des-ede3', process.env.SECRET_KEY, "");
  let theCipher = encrypt.update(this.password, 'utf8', 'base64');
  theCipher += encrypt.final('base64');
  this.password = theCipher;

  return Promise.resolve();
}

userSchema.virtual('decryptPassword').get(function decryptPassword() {
  const decrypt = crypto.createDecipheriv('des-ede3', process.env.SECRET_KEY, "");
  const password = decrypt.update(this.password, 'base64', 'utf8');
  return password + decrypt.final('utf8');
});

userSchema.pre('save', hashPassword);

module.exports = gstore.model('User', userSchema);
