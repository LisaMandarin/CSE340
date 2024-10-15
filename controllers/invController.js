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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect
  })
}


invCont.buildAddView = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    nav,
    title: "Add New Classification",
    errors: null,
  })
}

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  
  let addResult = await invModel.addClassification(classification_name)
  nav = await utilities.getNav()
  
  if (addResult) {
    req.flash(
      "notice",
      `You have added a new classification ${classification_name}`
    )

    res.redirect("/inv")
  } else {
    req.flash("notice", "Adding classification failed.")
    res.render("./inventory/add-classification", {
      nav,
      title: "Add Classification",
      errors: null,
    })
  }
}

invCont.buildAddInv = async function(req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    nav,
    title: "Add New Vehicle",
    classificationSelect,
    errors: null
  })
}

invCont.addInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
  } = req.body
  const vehicle = `${inv_year} ${inv_make} ${inv_model}`
  
  let addResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  let classificationSelect = await utilities.buildClassificationList(classification_id)
  
  if (addResult) {
    req.flash("notice", `${vehicle} has been added to the inventory`)
    res.redirect('/inv')
  } else {
    req.flash("notice", "Adding vehicle failed")
    res.status(501).render("./inventory/add-inventory", {
      nav,
      title: "Add New Vehicle",
      classificationSelect,
      errors: null,
    })
  }
  
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build Modify Inventory View
 * ************************** */
invCont.editInvView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let invData = await invModel.getInventoryByInvId(inv_id)
  let vehicle = invData[0]
  let classificationSelect = await utilities.buildClassificationList(vehicle.classification_id)
  const vehicleName = `${vehicle.inv_make} ${vehicle.inv_model}`
  
  res.render('./inventory/edit-inventory', {
    nav,
    title: `Edit ${vehicleName}`,
    errors: null,
    classificationSelect,
    inv_id: vehicle.inv_id,
    inv_make: vehicle.inv_make,
    inv_model: vehicle.inv_model,
    inv_year: vehicle.inv_year,
    inv_description: vehicle.inv_description,
    inv_image: vehicle.inv_image,
    inv_thumbnail: vehicle.inv_thumbnail,
    inv_price: vehicle.inv_price,
    inv_miles: vehicle.inv_miles,
    inv_color: vehicle.inv_color,
    classification_id: vehicle.classification_id
  })
}

/* ***************************
 *  Update Inventory
 * ************************** */
invCont.updateInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
  } = req.body
    
  let updateResult = await invModel.updateInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id)
  
  if (updateResult) {
    const vehicle = `${updateResult.inv_make} ${updateResult.inv_model}`
    req.flash("notice", `${vehicle} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const vehicle = `${inv_make} ${inv_model}`
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      nav,
      title: `Edit ${vehicle}`,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  }
  
}

/* ***************************
 *  Build Delete Inventory View
 * ************************** */
invCont.deleteInvView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let invData = await invModel.getInventoryByInvId(inv_id)
  let vehicle = invData[0]
  const vehicleName = `${vehicle.inv_make} ${vehicle.inv_model}`
  
  res.render('./inventory/delete-inventory', {
    nav,
    title: `Delete ${vehicleName}`,
    errors: null,
    inv_id: vehicle.inv_id,
    inv_make: vehicle.inv_make,
    inv_model: vehicle.inv_model,
    inv_year: vehicle.inv_year,
    inv_price: vehicle.inv_price,
  })
}

/* ***************************
 *  Delete Inventory
 * ************************** */
invCont.deleteInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  const {inv_id, inv_make, inv_model} = req.body
  const vehicle = `${inv_make} ${inv_model}`
  let deleteResult = await invModel.deleteInventory(inv_id)
  
  if (deleteResult) {
    req.flash("notice", `${vehicle} was deleted`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

module.exports = invCont