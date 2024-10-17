const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  )
  
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Login
* *************************************** */
// async function loginAccount(req, res) {
//   let nav = await utilities.getNav()
//   const { account_email, account_password } = req.body
  
//   const account = await accountModel.loginAccount(
//     account_email,
//   )
  
//   if (await bcrypt.compare(account_password, account.account_password)) {
//     res.status(200).send('Login successful')  
//   } else {
//     req.flash("notice", "Sorry, Invalid email or password.")
//     res.status(401).render("account/login", {
//       title: "Login",
//       nav,
//       errors: null,
//       account_email
//     })
//   }
// }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
    req.flash("notice", "You have logged in.")
    res.locals.account_firstname = accountData.account_firstname
   res.redirect("/account/")
   } else {
    req.flash("notice", "Sorry, Invalid email or password.")
    res.status(401).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email
    })
  }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
 }

 /* ****************************************
 *  Deliver Management view
 * ************************************ */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  let link = await utilities.buildAccountLink(res.locals.accountData)

  res.render("account/management", {
    nav,
    title: "Account Management",
    errors: null,
    account_firstname: res.locals.accountData.account_firstname,
    link
  })
} 

 /* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  res.redirect("/")
}

 /* ****************************************
 *  Build update account view
 * ************************************ */
async function buildUpdateView(req, res, next) {
  let nav = await utilities.getNav()
    
  res.render("account/edit-account", {
    nav,
    title: "Edit Account",
    firstname: res.locals.accountData.account_firstname,
    lastname: res.locals.accountData.account_lastname,
    email: res.locals.accountData.account_email,
    account_id: res.locals.accountData.account_id,
    errors: null
  })

}

/* ***************************
 *  Update Account
 * ************************** */
async function updateAccount(req, res, next) {
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  let updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
  
  if (updateResult) {
    const newAccountData = await accountModel.getAccountById(account_id)

    if (!newAccountData) {
      req.flash("notice", "Retrieving new account data failed.")
      return res.redirect("/account/login")
    }
    
  delete newAccountData.account_password
  const accessToken = jwt.sign(newAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600})

  if (process.env.NODE_ENV === 'development') {
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
  } else {
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000, secure: true})
  }
  
  req.flash("notice", "Congratulations, your information has been updated.")
  res.redirect("/account/")

  } else {
    req.flash("notice", "Sorry, the update failed")
    res.redirect(`/account/edit-account/${account_id}`)
  }
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, accountLogout, buildUpdateView, updateAccount }