const express = require('express')
const router = new express.Router()
const utilities = require('../utilities')
const accountController = require('../controllers/accountController')
const accountValidate = require('../utilities/account-validation')

router.get('/login', utilities.handleErrors(accountController.buildLogin))
router.get('/register', utilities.handleErrors(accountController.buildRegister))

router.post(
    '/register', 
    accountValidate.registrationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))


// Process the login attempt
router.post(
    "/login",
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

router.get('/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement))

module.exports =router