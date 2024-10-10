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


module.exports = validate