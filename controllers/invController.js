const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build details by vehicleDetails view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const vehicle = data[0]
  const content = await utilities.buildInventoryDetails(vehicle)
  let nav = await utilities.getNav()
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  res.render("./inventory/vehicleDetails", {
    title: vehicleName,
    nav,
    content
  })
}

invCont.buildError = async function (req, res, next) {
  const inv_id = 100
  const data = await invModel.getInventoryByInvId(inv_id)
  const vehicle = data[0]
  const content = await utilities.buildInventoryDetails(vehicle)
  let nav = await utilities.getNav()
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  res.render("./inventory/vehicleDetails", {
    title: vehicleName,
    nav,
    content
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}


invCont.buildAddView = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    nav,
    title: "Add New Classification",
    errors: null
  })
}

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  let addResult = await invModel.addClassification(classification_name)
  
  if (addResult) {
    req.flash(
      "notice",
      `You have added a new classification ${classification_name}`
    )

    res.status(201).render("inventory/management", {
      nav,
      title: "Vehicle Management",
      errors: null
    })
  } else {
    req.flash("notice", "Adding classification failed.")
    res.status(501).render("inventory/add-classification", {
      nav,
      title: "Add Classification",
      errors: null,
    })
  }


  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

module.exports = invCont