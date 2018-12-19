'use strict';

// [START app]
const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./api/auth');
const app = express();

app.use(express.static('build/es6-unbundled/public'));
app.use('/node_modules', express.static('build/es6-unbundled/node_modules'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth', auth);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
// [END app]

module.exports = app;