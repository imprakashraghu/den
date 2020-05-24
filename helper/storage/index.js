'use strict';

// core modules
const fs = require('fs');
const path = require('path');
const os = require('os');
// user defined module
const h = require('../secure');
// global path variables for den storage
const userDataPath = path.join('your_data_path');
const dataPath = path.join('your_data_path');

/**
 * initialization of den storage
 * @param {object} ans
 * returns a promise value 
 */
let init = (ans) => {  
    
    return new Promise((resolve, reject) => {      

        if(!os.homedir()) {
            reject("something went wrong!");
        }
        
        let denDir = path.join('your_basepath');
        let storageDir = path.join('your_storage_path');        
    
        if(!fs.existsSync(denDir)) {
            fs.mkdirSync(denDir);  
            if(!fs.existsSync(storageDir)) {
                fs.mkdirSync(storageDir);                   
               
                createUser(ans)
                .then(res => {
                    resolve(res);
                })
                .catch(e => reject("Try Again!")); 

            }                     
        }else {
            resolve("duplicate");
        }       

    });    
          
}

/**
 * creating a master user
 * @param {object} user 
 * returns a promise value
 */
let createUser = (user) => {

    return new Promise((resolve, reject) => {  
        
        let masterUser = {
            ...user,
            time: new Date()
        }
        
        let userGenerated = JSON.stringify(masterUser);

        let encodedUser = h.encrypt(userGenerated);
        initDen(dataPath);
        fs.writeFile(userDataPath, encodedUser, (err) => {

            if(err){ reject(err) } 

            resolve("Den initialized successfully");            
        });              
          
    });

}

/**
 * initiating the path for den storage
 * @param {string} dir 
 */
let initDen = (dir) => {

        let currentUser = os.userInfo().username;

        let tmp = {
            data:[]
        };
    
        let buffer = h.encrypt(JSON.stringify(tmp));
    
        fs.writeFile(dir, buffer , (err) => {
            if(err) {
                console.log(err);
            }        
        });
       
}

module.exports ={
    init
}
