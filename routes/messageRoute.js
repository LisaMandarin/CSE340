const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const msgController = require("../controllers/messageController")

/* ***********************
* Build add message View
*********************** */
router.get("/add-message",
    utilities.checkLogin,
    utilities.handleErrors(msgController.addMessage)
)

module.exports = router