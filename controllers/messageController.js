const utilities = require('../utilities')

/* ****************************************
*  Deliver add message view
* *************************************** */
async function addMessage(req, res, next) {
    let nav = await utilities.getNav()
    let recipientListSelect = await utilities.recipientListSelect()
    res.render("message/add-message", {
        nav,
        title: "New Message",
        errors: null,
        recipientListSelect,
    })
}

/* ****************************************
*  Deliver message management view
* *************************************** */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    const name = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`
    res.render("message/management", {
        nav,
        title: `${name} Inbox`,
        errors: null
    })
}


module.exports = { addMessage, buildManagement }