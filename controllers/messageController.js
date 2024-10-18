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

module.exports = { addMessage }