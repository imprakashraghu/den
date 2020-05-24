'use strict';

// core modules
const os = require('os');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
// user defined modules
const auth = require('./auth');
const h = require('./secure');
// global path variables
const homePath = path.join('home_path');
const basePath = path.join('base_path');
const authPath = path.join('authentication_path');
const storagePath = path.join('storage_path');

/**
 * storing password data
 * @param {object} data 
 * writing into the file
 * encrypts the content
 * returns a promise value
 */
let storePassword = (data) => {
    return new Promise((resolve, reject) => {

        let temp_password_data = {
            ...data,
            time: new Date()
        };

        fs.readFile(basePath, (error, result) => {

            if(error) console.log(error);

            let decprtedData = h.decrypt(result.toString());
            
            let temp_data = JSON.parse(decprtedData);

            temp_data.data.push(temp_password_data);
            
            let final = JSON.stringify(temp_data);

            let encryptedFinal = h.encrypt(final);

            fs.writeFile(basePath, encryptedFinal, (err) => {
                if(err) {
                    reject(err)
                }
                resolve("success");
            });
            
        }); 
    
    });
}

/**
 * erases all the password data from the storage
 * returns a promise value
 */
let eraseAll = () => {
    return new Promise((resolve, reject) => {
        let status = deleteFolderRecursive(homePath);
        if(status) {
            resolve("success");
        }else {
            reject("Den is not initialized");
        }
    });
}

/**
 * deletes the directory structure recursive
 * @param {string} path 
 * credits: stackoverflow
 * returns boolean value
 */
let deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file,index){
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    } else {
        return false;
    }
    return true;
};


/**
 * checks the security answer
 * @param {object} ans 
 * returns a promise value
 */
let securityAnswer = (ans) => {
    return new Promise((resolve, reject) => {
        fs.readFile(authPath, (error, data) => {
            if(error) {
                reject(error);
            }         
            let buffer = data.toString();
            let decprted = h.decrypt(buffer); 
            let tmp = JSON.parse(decprted);  
    
            if(ans === tmp.sanswer) {
                resolve("success");
            } else {
                resolve("WRONG ANSWER");
            }
    
        }); 
    });
}

/**
 * rewrites the authentication file
 * @param {object} password 
 * returns a promise value
 */
let changePassword = (password) => {
    return new Promise((resolve, reject) => {
        fs.readFile(authPath, (error, data) => {
            if(error) {
                reject(error);
            }    

            let buffer = data.toString();
            let decprted = h.decrypt(buffer); 
            let tmp = JSON.parse(decprted);  

            tmp.mpassword = password;
            
            let userGenerated = JSON.stringify(tmp);

            let encodedUser = h.encrypt(userGenerated);

            fs.writeFile(authPath, encodedUser, (err) => {
                if(err){ reject(err) } 
                resolve("success");            
            });              
            

        }); 
    });
}

/**
 * shows the data file
 * returns a promise value
 */
let showAllPasswords = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(basePath, (error, result) => {
            if(error) {
                reject(error);
            }
            let decprtedData = h.decrypt(result.toString());
            let tmp_result = JSON.parse(decprtedData);                                                

                resolve(tmp_result);                        
                                  
        });
    });
    
}

/**
 * shows the authentication file
 * returns a promise value
 */
let showUsers = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(authPath, (error, data) => {
        if(error) {
            reject(error);
        }         
        let buffer = data.toString();
        let decprted = h.decrypt(buffer); 
        let tmp = JSON.parse(decprted);  
        resolve(tmp);
    }); 
});
}

/**
 * shows the auth file
 * returns a promise value
 */
let insightStorage = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(basePath, (error, data) => {
            if(error) {
                reject(error);
            }         
            let buffer = data.toString();
            let decprted = h.decrypt(buffer); 
            let tmp = JSON.parse(decprted);  
    
            resolve(tmp);
    });
});
}

/**
 * checks the directory file existence
 * returns a promise value
 */
let checkDenStorageStatus = () =>{
    return new Promise((resolve, reject) => {

        if(fs.existsSync(storagePath)) {
            resolve("success");
        } else {
            reject("Den is not initialized yet! To initialize use: den init");
        }
    });
}

/**
 * deletes the password data by the property given
 * @param {string} prop 
 * returns a promise value
 */
let deletePasswordByProp = (prop) => {
    return new Promise((resolve, reject) => {

        fs.readFile(basePath, (error, result) => {

            if(error) console.log(error);

            let decprtedData = h.decrypt(result.toString());
            
            let temp_data = JSON.parse(decprtedData);
            
            let check = 0;
            for(let u in temp_data.data) {
                if(temp_data.data[u].prop === prop) {
                    temp_data.data.splice(u,1);
                    check = 1;
                }
            }         
            if(check==0) {
                reject("Property not present");
            }
            let final = JSON.stringify(temp_data);

            let encryptedFinal = h.encrypt(final);

            fs.writeFile(basePath, encryptedFinal, (err) => {
                if(err) {
                    reject(err)
                }
                resolve("success");
            });
            
        }); 

    });
}

/**
 * deletes the password data by the account type given
 * @param {string} account 
 * returns a promise value
 */
let deletePasswordByAccountType = (account) => {
    return new Promise((resolve, reject) => {

        fs.readFile(basePath, (error, result) => {

            if(error) console.log(error);

            let decprtedData = h.decrypt(result.toString());
            
            let temp_data = JSON.parse(decprtedData);
            
            let check = 0;
            for(let u in temp_data.data) {
                if(temp_data.data[u].accountType === account) {
                    temp_data.data.splice(u,1);
                    check = 1;
                }
            }         
            if(check==0) {
                reject("Account type not present");
            }
            let final = JSON.stringify(temp_data);

            let encryptedFinal = h.encrypt(final);

            fs.writeFile(basePath, encryptedFinal, (err) => {
                if(err) {
                    reject(err)
                }
                resolve("success");
            });
            
        }); 

    });
}

module.exports = {
    storePassword,
    showAllPasswords,
    showUsers,
    insightStorage,
    changePassword,
    securityAnswer,
    eraseAll,
    checkDenStorageStatus,
    deletePasswordByProp,
    deletePasswordByAccountType
}
