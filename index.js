/**
 * @author hemaprakash raghu 
 * @version 1.0.0
 * @license MIT
 * description password manager tool
 * language nodejs
 * packaged pkg
 * location India
 * exported EXE
 */

// core modules
const os = require('os');
const path = require('path');
const fs = require('fs');

// external modules
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const program = require('commander');

// user defined modules
const storage = require('./helper/storage')
const auth = require('./helper/auth');
const helper = require('./helper');
const commands = require('./commands');
const questions = require('./questions');


/**
 * commander initialization
 * version 1.0.0
 */
program
    .version("1.0.0")
    .description("Password Manager Tool");

/**
 * default override of help command
 * added the usage
 */

program.on("--help", ()=> {
    console.log('\n');
    console.log('usage: den [--version] [--help] [help] [store] [destroy] [open] [show account] [delete] [init]');    
});  
    
/**
 * help commmand
 * shortcut <h>
 * provides the description of available commands  
 */
program
    .command("help")
    .alias("h")
    .description("To know about other helper commands")
    .action(() => {
        console.log(
            chalk.blue(
            figlet.textSync('Den', { horizontalLayout: 'full' })
            )
        );
        console.log("\nden commands help");
        console.log("\n");
        console.log("\nusage: den: [--version] [help]");
        console.log("\n");
        console.log("\nden init --initializes the den storage");
        console.log("\nden master --access the master profile");
        console.log("\nden store --store the password");
        console.log("\nden delete --delete a specific password by selecting either account type or property");
        console.log("\nden destroy --delete the entire den storage");
        console.log("\nden open --view the passwords by property");
        console.log("\nden show account --view the passwords by account type parameter");
        console.log("\nden help --to know about all other commands");
        console.log("\n");
    });

/**
 * init commmand
 * shortcut <i>
 * initializes the den storage by creating required directories and folders
 * to store the passwor data
 */
program
    .command("init")
    .alias("i")
    .description("Initiation of den storage boxes")
    .action(() => {
        let temp_check_dir = path.join(os.homedir(), '\\.den\\storage\\auth');
        if(fs.existsSync(temp_check_dir)) {
            console.log(chalk.yellow("Den is already initialized"));
        } else {
            inquirer.prompt(questions.addUserQuestions).then(answers => {
                if(answers.agreement) {
                    commands.initiation(answers);
                } else {
                    console.log(chalk.yellow('Den Initialization cancelled'));
                }
                
            });
        }       
    });

/**
 * master commmand
 * shortcut <m>
 * enter master access using master password
 * can view password status
 * can view profile status
 * can change the master password
 */
program
    .command("master")
    .alias("m")
    .description("Access as a master")
    .action(() => {
        let temp_check_dir = path.join(os.homedir(), '\\.den\\storage\\auth');
        if(fs.existsSync(temp_check_dir)) {
            helper.checkDenStorageStatus().then(status => {
                if(status === "success") {
                    inquirer.prompt(questions.accessAsMaster).then(answers => {
                        commands.masterAccess(answers.mpassword)
                        .then(masterResponse => {
                            if(masterResponse === "success") {
            
                                console.log(
                                    chalk.blue(
                                    figlet.textSync('Den', { horizontalLayout: 'full' })
                                    )
                                );
            
                                inquirer.prompt(questions.masterAccess).then(ans => {
                                    if(ans.moptions === "Change Master Password") {
                                        helper.showUsers().then(ques => {
                                            console.log(chalk.bgYellow(ques.squestion));
            
                                            inquirer.prompt(questions.changeMasterPasswordRequest).then(answers => {
                                            
                                                commands.checkSecurityQuestion(answers.sanswer)
                                                .then(response => {
                                                    if(response === "success") {
                
                                                        inquirer.prompt(questions.changeMasterPassword).then(answer => {
            
                                                            if(answer.agreement) {
                                                                commands.changePasswordMaster(answer.mpassword, answer.cmpassword).then(ans => {
                                                                    if(ans === "success") {
                                                                        console.log(chalk.green("PASSWORD CHANGED"));
                                                                    }else {
                                                                        console.log(chalk.yellow("TRY AGAIN"));
                                                                    }
                                                                })
                                                                .catch(e => console.log(chalk.red(e)));
                                                            } else {
                                                                console.log(chalk.yellow('Attempt Cancelled'))
                                                            }
                                                           
                                                        })
                                                        .catch(e => console.log(chalk.red(e)));
                
                                                    } else {
                                                        console.log(chalk.red(response));
                                                    }
                                                })
                                            })
                                            .catch(e => console.log(chalk.red(e)));
            
                                        }).catch(e => console.log(chalk.red(e)));                            
            
                                    } else {
                                        commands.masterOptions(ans.moptions);
                                    }                       
                                })
                                .catch(e => console.log(chalk.red(e)));
            
                            }else {
                                console.log(chalk.red(e));
                            }
                        })
                        .catch(e => console.log(chalk.red(e)));       
                    })
                    .catch(e => console.log(chalk.red(e)));     
                }
            })
            .catch(error => console.log(chalk.yellow(error)));
        }   else {
            console.log(chalk.yellow('Den is not initialized yet! To initialize use: den init'));
        }      
    });

/**
 * store commmand
 * shortcut <s>
 * stores the password
 * to store the password data including the time of created in a json format
 * requires master password
 */
program
    .command("store")
    .alias("s")
    .description("Store a password")
    .action(() => {
        let temp_check_dir = path.join(os.homedir(), '\\.den\\storage\\data');
        if(fs.existsSync(temp_check_dir)) {
            helper.checkDenStorageStatus().then(status => {
                if(status === "success") {
                    inquirer.prompt(questions.storePassword).then(answers => {
                        if(answers.agreement) {
            
                            commands.storeData(answers);
            
                        } else {
                            console.log(chalk.yellow('Attempt Cancelled'))
                        }
                    })
                    .catch(e => console.log(chalk.red(e)));
                }
            })
            .catch(e => console.log(chalk.yellow(e)));       
        } else {
            console.log(chalk.yellow('Den is not initialized yet! To initialize use: den init'));
        }
        
    });

/**
 * destroy commmand
 * shortcut <d>
 * deletes all the directories and folders belonged to den
 * clean up the password data
 * only used in case of emergency
 * requires master password
 */
program
    .command("destroy")
    .alias("d")
    .description("Erase the entire den storage")
    .action(() => {
        let temp_check_dir = path.join(os.homedir(), '\\.den\\storage\\auth');
        if(fs.existsSync(temp_check_dir)) {
            inquirer.prompt(questions.accessAsMaster).then(answer => {
                commands.masterAccess(answer.mpassword).then(res => {
                    if(res === "success") {
    
                        commands.destoryDenStorage();
    
                    }
                })
                .catch(e => console.log(chalk.red(e)));
            })
            .catch(e => console.log(chalk.red(e)));
        }else {
            console.log(chalk.yellow('Den is not initialized yet! To know about commands use den help'));
        }
      
    });


/**
 * open commmand
 * shortcut <o>
 * view all the stored password using the property as the index
 * automatically copies ot clipboard when viewed
 * requires master password
 */
program
    .command("open")
    .alias("o")
    .description("Show all the passwords in the storage")
    .action(() => {
        let temp_check_dir = path.join(os.homedir(), '\\.den\\storage\\data');
        if(fs.existsSync(temp_check_dir)) {
            inquirer.prompt(questions.accessAsMaster).then(answer => {
                commands.masterAccess(answer.mpassword).then(res => {
                    if(res === "success") {
    
                        commands.showAllData();
                        
                    }
                })
                .catch(e => console.log(chalk.red(e)));
            })
            .catch(e => console.log(chalk.red(e)));
        } else {
            console.log(chalk.yellow('Den is not initialized yet! To initialize use: den init'));
        }
        
    });

/**
 * show commmand
 * parameter <type>
 * view all the passwords by account type indexing
 * requires master password
 */
program
    .command("show <type>")
    .description("Show all the passwords in the storage by account type")
    .action((type) => {        
        let temp_check_dir = path.join(os.homedir(), '\\.den\\storage\\data');
        if(fs.existsSync(temp_check_dir)) {
            inquirer.prompt(questions.accessAsMaster).then(answer => {
                commands.masterAccess(answer.mpassword).then(res => {
                    if(res === "success") {
    
                        if(type === "account") {
                            commands.showAllDataByAccountType();
                        } else {
                            console.log(chalk.yellow("Unknown parameter. use den help for helper commands"));
                        }
                        
                    }
                })
                .catch(e => console.log(chalk.red(e)));
            })
            .catch(e => console.log(chalk.red(e)));
        }  else {
            console.log(chalk.yellow('Den is not initialized yet! To initialize use: den init'));
        }      
    });


/**
 * delete commmand
 * shortcut <d>
 * deletes a specific password either with account type or password property
 * requires master password
 */
program
    .command("delete")
    .alias("d")
    .description("Deleting a specific password data from the storage")
    .action(() => {
        let temp_check_dir = path.join(os.homedir(), '\\.den\\storage\\data');
        if(fs.existsSync(temp_check_dir)) {
            inquirer.prompt(questions.accessAsMaster).then(answer => {
                commands.masterAccess(answer.mpassword).then(res => {
                    if(res === "success") {
    
                        inquirer.prompt(questions.deleteOption).then(answer => {
                            commands.deletePasswordData(answer.doption);
                        }).catch(e => console.log(chalk.red(e)));
                        
                    }
                })
                .catch(e => console.log(chalk.red(e)));
            })
            .catch(e => console.log(chalk.red(e)));
        } else {
            console.log(chalk.yellow('Den is not initialized yet! To initialize use: den init'));
        }
        
    });

program.parse(process.argv);
