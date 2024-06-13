const fs = require('fs');
const path = require('path');

const allowedIdentifications = JSON.parse(fs.readFileSync(path.join(__dirname, 'allowed_identifications.json')));

module.exports = allowedIdentifications;
