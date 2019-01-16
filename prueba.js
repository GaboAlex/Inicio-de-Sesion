var crypto = require('crypto');
var password = "12345"
var salt = crypto.randomBytes(16).toString('hex');

console.log(crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex'));
