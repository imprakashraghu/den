'use strict';

// core module
const os = require('os');
// user defined module
const h = require('../helper');

// questions for creating a master user
const addUserQuestions = [
    {
        type: 'input',
        name: 'musername',
        message: 'Master Name',
        default: os.userInfo().username
    },
    {
        type: 'password',
        name: 'mpassword',
        message: 'Master Password',
        required: true
    },
    {
        type: 'input',
        name: 'squestion',
        message: 'Security Question',
        default: 'What\'s your pet name?'
    },
    {
        type: 'input',
        name: 'sanswer',
        message: 'Answer for question'
    },
    {
        type: 'confirm',
        name: 'agreement',
        message: 'Confirm Initiation?',
        default: true
    }
];
// questions for accessing a master
const accessAsMaster = [
    {
        type: 'password',
        name: 'mpassword',
        message: 'Master Password'
    }
];
// options for master access
const masterAccess = [
    {
        type: 'list',
        name: 'moptions',
        message: 'Choose to access',
        choices: ['Profile','Storage','Change Master Password']
    }
];
// questions for request to changing the master password
const changeMasterPasswordRequest = [
    {
        type: 'input',
        name: 'sanswer',
        message: 'Security Answer'
    }
];
// questions for changing the master password
const changeMasterPassword = [
    {
        type: 'password',
        name: 'mpassword',
        message: 'New Master Password'
    },
    {
        type: 'password',
        name: 'cmpassword',
        message: 'Retype New Master Password'
    },
    {
        type: 'confirm',
        name: 'agreement',
        message: 'Confirm Password Change?'
    }
];
// questions to store a password data
const storePassword = [
    {
        type: 'input',
        name: 'accountType',
        message: 'Account Type',
        default: 'gmail',
        required: true
    },
    {
        type: 'input',
        name: 'prop',
        message: 'Password property (den@example.com)',
        required: true
    },
    {
        type: 'password',
        name: 'password',
        message: 'Password'
    },
    {
        type: 'confirm',
        name: 'agreement',
        message: 'Are you sure to store?',
        default: true
    }
];
// options for deleting a password
const deleteOption =
    {
        type: 'list',
        name: 'doption',
        choices: ['Property','Account Type'],
        message: 'Delete Passwords By'
};

module.exports = {
    addUserQuestions,
    accessAsMaster,
    masterAccess,
    changeMasterPasswordRequest,
    changeMasterPassword,
    storePassword,
    deleteOption
}