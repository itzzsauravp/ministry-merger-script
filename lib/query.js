const db = require("../db");
const logger = require("../helpers/logger");

async function Query(pquery, params, data) {
    try {
        return await db.query(pquery, params);
    } catch (error) {
        logger.logError({ data, query: pquery, error });
        console.log(error);
    }
}

module.exports = Query;
