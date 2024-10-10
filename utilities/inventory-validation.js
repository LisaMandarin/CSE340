const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({min: 1})
        .isAlpha()
        .withMessage("A valid classification name is required.")
        .custom(async(classification_name) => {
            const nameExists = await invModel.checkExistingName(classification_name)
            if (nameExists) {
                throw new Error("Classification name already exists.")
            }
        })
    ]
}

validate.checkClassificationName = async(req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            nav,
            title: "Add New Classification",
            errors,
            classification_name
        })
        return
    }
    next()
}

validate.invRules = () => {
    return [
        body("classification_id")
        .notEmpty()
        .isInt()
        .withMessage("Choose a valid classification."),

        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isAlphanumeric()
        .isLength({min: 3})
        .withMessage("Enter a valid vehicle make."),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isAlphanumeric()
        .isLength({min: 3})
        .withMessage("Enter a valid vehicle model."),

        body("inv_year")
        .notEmpty()
        .isInt({min: 1000, max: 9999})
        .withMessage("Enter a valid year."),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Enter the vehicle description."),

        body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Enter the image path."),

        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Enter the thumbnail path."),

        body("inv_price")
        .notEmpty()
        .isFloat({min: 0})
        .withMessage("Enter price in decimal or integer."),

        body("inv_miles")
        .notEmpty()
        .isFloat({min: 0, max: 999999999})
        .withMessage("Enter digits only"),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Enter a valid color")
        
    ]
}

validate.checkInvName = async(req, res, next) => {
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
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = utilities.getNav()
        let classificationNames = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", {
            nav,
            title: "Add New Vehicle",
            classificationNames,
            errors,
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
        return
    }
    next()
}

module.exports = validate