// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

/* *************
* Build View
************* */
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory details
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build Error view on purpose
router.get("/error", utilities.handleErrors(invController.buildError));

// Route to build inventory management view
router.get("/",
    utilities.checkLogin, 
    utilities.checkAuthZ,
    utilities.handleErrors(invController.buildManagement));

// Route to build add-inventory view
router.get("/add-classification", utilities.handleErrors(invController.buildAddView));

// Route to build add-classification view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInv));

// Route to retrieve inventory json by classification (used for edit/delete inventory)
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
)

// Route to build edit-inventory view
router.get(
    "/edit/:inv_id",
    utilities.handleErrors(invController.editInvView)
)

// Route to build delete-inventory view
router.get(
    "/delete/:inv_id",
    utilities.handleErrors(invController.deleteInvView)
)

/* *************
* Process View
************* */
// Process add-classification
router.post(
    "/add-classification", 
    invValidate.classificationRules(),
    invValidate.checkClassificationName,
    utilities.handleErrors(invController.addClassification)
)

// Process add-inventory
router.post(
    "/add-inventory",
    invValidate.invRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

// Process update (after editing inventory)
router.post(
    "/update/",
    invValidate.invRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Process delete (after deleting inventory)
router.post(
    "/delete/",
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;