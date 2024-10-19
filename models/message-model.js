const pool = require("../database/")

/* ***************************
 *  Add message
 * ************************** */
async function addMessage(message_from, message_to, message_subject, message_body, message_created ) {
    try {
        const sql = "INSERT INTO message (message_from, message_to, message_subject, message_body, message_created) VALUES ($1, $2, $3, $4, $5)"
        const result = await pool.query(sql, [message_from, message_to, message_subject, message_body, message_created])
        return result.rowCount
    } catch (error) {
        throw new Error("Failed to create new message")
    }
}

module.exports = { addMessage }