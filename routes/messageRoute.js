const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const msgController = require("../controllers/messageController")
const msgValidate = require("../utilities/message_validation")

/* ***********************
* Build add message View
*********************** */
router.get("/add-message",
    utilities.checkLogin,
    utilities.handleErrors(msgController.buildAddMessage)
)

/* ****************************
* Build message management View
**************************** */
router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(msgController.buildManagement)
)

/* ****************************
* Process Add Message
**************************** */
router.post("/add-message", 
    utilities.checkLogin,
    msgValidate.addMsgRules(),
    msgValidate.checkAddMsg,
    utilities.handleErrors(msgController.addMessage)
)

/* ****************************
* Build read-Message
**************************** */
router.get("/read/:message_id", 
    utilities.checkLogin,
    utilities.handleErrors(msgController.buildReadMessage)
)

module.exports = router