const Util = require('../utilities')
const utilities = require('../utilities')
const msgModel = require('../models/message-model')


/* ****************************************
*  Build add message view
* *************************************** */
async function buildAddMessage(req, res, next) {
    let nav = await utilities.getNav()
    const message_from = res.locals.accountData.account_id
    let recipientListSelect = await utilities.recipientListSelect(message_from, null)
    res.render("message/add-message", {
        nav,
        title: "New Message",
        errors: null,
        recipientListSelect,
        message_from,
    })
}

/* ****************************************
*  Build message management view
* *************************************** */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    const name = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`
    let msgTable = await utilities.getMsgTable(res.locals.accountData.account_id)
    res.render("message/management", {
        nav,
        title: `${name} Inbox`,
        errors: null,
        msgTable,
    })
}

/* ****************************************
*  Add Message
* *************************************** */
async function addMessage(req, res) {
    let nav = await utilities.getNav()
    const { message_from, message_to, message_subject, message_body, message_created } = req.body
    let recipientListSelect = await utilities.recipientListSelect(message_from, message_to)
    try {
        const result = await msgModel.addMessage(message_from, message_to, message_subject, message_body, message_created)
        if (!result) {
            req.flash("notice", "Adding message process failed")
            res.render("message/add-message", {
                nav,
                title: "New Message",
                errors: null,
                recipientListSelect,
                message_from,
                message_to,
                message_subject,
                message_body,
                message_created,
            })
        }
        req.flash("notice-success", "Message sent successfully")
        res.redirect("/message")
    } catch (error) {
        req.flash("notice", "Failed to send message.  Please try again.")
        res.render("message/add-message", {
            nav,
            title: "New Message",
            errors: null,
            recipientListSelect,
            message_from,
            message_to,
            message_subject,
            message_body,
            message_created,
        })
    }
}

/* ****************************************
*  Read Message
* *************************************** */
async function buildReadMessage(req, res, next) {
    const message_id = req.params.message_id
    let nav = await utilities.getNav()
    const msgData = await msgModel.getMessageByMessage_id(message_id)
    console.log(msgData)
    res.render(
        "message/read-message", {
        nav,
        errors: null,
        title: msgData.message_subject,
        subject: msgData.message_subject,
        sender_name: msgData.sender_name,
        content: msgData.message_body,
        }
    )
}

module.exports = { buildAddMessage, buildManagement, addMessage, buildReadMessage }