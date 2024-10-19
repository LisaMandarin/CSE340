const Util = require('../utilities')
const utilities = require('../utilities')
const msgModel = require('../models/message-model')


/* ****************************************
*  Build add message view
* *************************************** */
async function buildAddMessage(req, res, next) {
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
*  Build message management view
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

/* ****************************************
*  Add Message
* *************************************** */
async function addMessage(req, res) {
    let nav = await utilities.getNav()
    const { message_to, message_subject, message_body, account_id, message_created } = req.body
    try {
        const result = await msgModel.addMessage(account_id, message_to, message_subject, message_body, message_created)
        if (!result) {
            req.flash("notice", "Adding message process failed")
            res.render("message/add-message", {
                nav,
                title: "New Message",
                errors: null,
                recipientListSelect,
                message_to,
                message_subject,
                message_body,
                account_id,
                message_created
            })
        }
        return result.rowCount
    } catch (error) {

    }
}

module.exports = { buildAddMessage, buildManagement, addMessage }