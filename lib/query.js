const db = require("../db");
const logger = require("../helpers/logger");

async function Query(pquery, params, data, trnx) {
    try {
        if (trnx) {
            return await trnx.query(pquery, params);
        } else {
            return await db.query(pquery, params);
        }
    } catch (error) {
        logger.logError({ data, query: pquery, error });
        console.log(error);
    }
}

module.exports = Query;
