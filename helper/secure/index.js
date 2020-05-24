'use strict';

//core module
const crypto = require('crypto')
// globla variables for securing the file data
var algorithm = 'aes256';
var key = 'denappcliisapplicationdevelopedbyjaw';

/**
 * encrypting the given text
 * @param (string) text 
 * returns the encrypted text in hex format
 */
function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, key);  
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

    return encrypted;
}

/**
 * decrypting the given text
 * @param (string) text 
 * returns the decrypted text in utf8 format
 */
function decrypt(encrypted) {
    var decipher = crypto.createDecipher(algorithm, key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
}