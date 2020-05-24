'use strict';

// core modules
const os = require('os');
const fs = require('fs');
const crypto = require('crypto');
// user defined module
const h = require('../secure');
// path to den authentication storage
const basePath = `C:\\Users\\${os.userInfo().username}\\.den\\storage\\auth`;

/**
 * compares the user given password with the master password
 * @param {mpassword: string} user 
 * returns a promise
 */
let checkMasterPassword = (user) => {

    return new Promise((resolve, reject) => {

        fs.readFile(basePath, (error, data) => {
            if(error) {
                reject(error);
            }                            
                let buffer = h.decrypt(data.toString());
                let temp = JSON.parse(buffer);
                
                if(temp.mpassword === user) {
                                        
                    resolve('success');
    
                } else {
                    reject('\nAccess is Denied');
                }
    
        })    
    });    

}

module.exports = {
    checkMasterPassword
}