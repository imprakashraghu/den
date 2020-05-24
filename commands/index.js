'use strict';

// external modules
const chalk = require('chalk');
const inquirer = require('inquirer');
const figlet = require('figlet');
const clipboardy = require("copy-paste");
// user defined modules
const storage = require('../helper/storage');
const auth = require('../helper/auth');
const helper = require('../helper');

/**
 * initialization command
 * @param {musername: string, mpassword: string, squestion: string, sanswer: string, agreement: boolean} answers 
 * checks for reinitialization
 * creates respective directories for storage
 */
let initiation = (answers) => {
    storage.init(answers)
    .then(response => {
        if(response === "duplicate") {
            console.log(chalk.yellow("Den is already initialized"));
        } else {
            console.log(chalk.green(response));
        }        
    }) 
    .catch(error => {
        console.log(chalk.red(error));
    });  
}

/**
 * master access command
 * @param {mpassword: string} password 
 * compares the master password in the storage
 * returns a promise
 */
let masterAccess = (password) => {
   return new Promise((resolve, reject) => {
        auth.checkMasterPassword(password)
        .then(checkMaster => {
            if(checkMaster === "success") {
                console.log(chalk.green("MASTER ACCESSED"));
                resolve("success")
            } else {
                reject(checkMaster);
            }
        })
        .catch(error => reject(error));
    });
}

/**
 * master options
 * @param {moption: string} options 
 * checks for the option selected
 * displays details respectively
 */
let masterOptions = (options) => {
    
    if(options === "Profile") {
        helper.showUsers()
        .then(user => {            

            console.log(chalk.blue(`\nMASTER NAME: ${user.musername}`));
            console.log(chalk.blue(`\nMASTER PASSWORD: ${user.mpassword}`));            
            console.log(chalk.blue(`\nSECURITY QUESTION: ${user.squestion}`));
            console.log(chalk.blue(`\nCREATED: ${new Date(user.time)}`));
            console.log('\n');

        })
        .catch(e => console.log(chalk.red(e)));
    }
    else if(options === "Storage") {
        helper.insightStorage()
        .then(insight => {

            console.log(chalk.blue(`\nDEN STORAGE`));
            console.log(chalk.strikethrough(`\nPASSWORDS STORED: ${insight.data.length}`));            
            console.log(chalk.blue(`\nDATA FORMAT: ENCRYPTED`));            
            console.log('\n');

        })
        .catch(e => reject(e));
    }
}

/**
 * security question and answer check
 * @param {sanswer: string} ans 
 * checks for the given answer and returns a promise
 */
let checkSecurityQuestion = (ans) => {
    return new Promise((resolve, reject) => {
       helper.securityAnswer(ans)
       .then(repsonse => {
           resolve(repsonse);         
       })
       .catch(e => reject(e));
    });
}

/**
 * master password change
 * @param {mpassword: string} password 
 * @param {cmpassword: string} cpassword 
 * compares both the parameter and rewrites the password
 * returns a promise
 */
let changePasswordMaster = (password, cpassword) => {
    return new Promise((resolve, reject) => {
        if(password === cpassword) {
            helper.changePassword(password)
            .then(response => {
                resolve(response); 
            })
            .catch(e => reject(e));
        } else {
            resolve("pnotmatch");
        }
    })
}

/**
 * storing a password data
 * @param {accountType: string, prop: string, password: string, agreement: boolean } data 
 * writes the password to the den storage in the json array format
 * writing to the storage is encrypted
 * returns string
 */
let storeData = (data) => {
        helper.storePassword(data)
        .then(response => {
            
            if(response === "success") {
                console.log(chalk.green("Password Stored"))
            } else {
                console.log(chalk.red(response))
            }
        })
        .catch(e =>  console.log(chalk.red(e)));
}

/**
 * delete the entire storage
 * removes all the directories of den storage
 * returns string
 */
let destoryDenStorage = () => {
    helper.eraseAll()
    .then(response => {
        if(response === "success") {
            console.log(chalk.green("Den Storage is now destroyed successfully"))
        } else {
            console.log(chalk.yellow(e))
        }
    })
    .catch(e => console.log(chalk.red(e)));
}

/**
 * shows all the password data by the property
 * checks for empty
 */
let showAllData = () => {
    helper.showAllPasswords().then(response => {
        console.log(
            chalk.blue(
            figlet.textSync('Den', { horizontalLayout: 'full' })
            )
        );
        if(response.data.length) {
            let tmp_choices = [];
            for(let i in response.data) {
                tmp_choices.push(response.data[i].prop);
            }
            let showPasswords = {
                type: 'list',
                message: 'Select a prop',
                name: 'line',
                choices: tmp_choices,
            };
            inquirer.prompt(showPasswords).then(answers => {
                for(let j in response.data) {
                    if(response.data[j].prop === answers.line) {
                        console.log(`\nAccount Type: ${response.data[j].accountType}`);
                        console.log(`\nPassword: ${response.data[j].password}`);
                        console.log(`\nCreated: ${new Date(response.data[j].time)}`);
                        clipboardy.copy(response.data[j].password, function() {
                            console.log(chalk.yellow('\nPassword copied to clipboard!'));                 
                        });                        
                    }
                }
            });
        } else {
            console.log(chalk.yellow('\nStorage is empty'));    
        }
        
    })
    .catch(e => console.log(chalk.red(e)));
}

/**
 * show all the data by the account type
 * display data according to the selection
 */
let showAllDataByAccountType = () => {
    helper.showAllPasswords().then(response => {
        console.log(
            chalk.blue(
            figlet.textSync('Den', { horizontalLayout: 'full' })
            )
        );
        if(response.data.length) {
            let tmp_choices = [];
            for(let i in response.data) {
                tmp_choices.push(response.data[i].accountType);
            }
            let showPasswords = {
                type: 'list',
                message: 'Select a type of account',
                name: 'line',
                choices: tmp_choices,
            };
            inquirer.prompt(showPasswords).then(answers => {            
                for(let j in response.data) {
                    if(response.data[j].accountType === answers.line) {
                        console.log(`\nProperty: ${response.data[j].prop}`);
                        console.log(`\nPassword: ${response.data[j].password}`);
                        console.log(`\nCreated: ${new Date(response.data[j].time)}`);
                        clipboardy.copy(response.data[j].password, function() {
                            console.log(chalk.yellow('\nPassword copied to clipboard!'));                 
                        });                        
                    }
                }
            });
        } else {
            console.log(chalk.yellow('\nStorage is empty'));    
        }
        
    })
    .catch(e => console.log(chalk.red(e)));
}

/**
 * deletes the password by the selected type
 * @param (string) type 
 * 
 */
let deletePasswordData = (type) => {
    helper.showAllPasswords().then(response => {      
        if(response.data.length) {
            let tmp_choices = [];
            for(let i in response.data) {
                if(type === "Property") {
                    tmp_choices.push(response.data[i].prop);
                }
                if(type === "Account Type") {
                    tmp_choices.push(response.data[i].accountType);
                }
                
            }
            let showPasswords = {
                type: 'list',
                message: `Select a ${type}`,
                name: 'line',
                choices: tmp_choices,
            };
            inquirer.prompt(showPasswords).then(answers => {
                if(type === "Property") {
                    helper.deletePasswordByProp(answers.line).then(res => {
                        if(res === "success") {
                            console.log(chalk.green('Password deleted successfully'));
                        }
                    }).catch(e => console.log(chalk.red(e)));
                }
                if(type === "Account Type") {
                    helper.deletePasswordByAccountType(answers.line).then(res => {
                        if(res === "success") {
                            console.log(chalk.green('Password deleted successfully'));
                        }
                    }).catch(e => console.log(chalk.red(e)));
                }
            });
        } else {
            console.log(chalk.yellow('\nStorage is empty'));    
        }
        
    })
    .catch(e => console.log(chalk.red(e)));
}

module.exports = {
    initiation,
    masterAccess,
    masterOptions,
    checkSecurityQuestion,
    changePasswordMaster,
    storeData,
    destoryDenStorage,
    showAllData,
    showAllDataByAccountType,
    deletePasswordData
}

