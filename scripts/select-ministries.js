const db = require("../db");

async function selectMinistries() {
    console.log("Querying all ministries...");
    const result = await db.query("SELECT * FROM ministries");

    if (result.rows.length === 0) {
        console.log("No ministries found.");
    } else {
        console.table(result.rows);
    }
}

// Support running the script directly: node scripts/select-ministries.js
if (require.main === module) {
    (async () => {
        try {
            await selectMinistries();
        } catch (err) {
            console.error("Error running script:", err);
        } finally {
            await db.pool.end();
            console.log("Database pool closed.");
        }
    })();
}

module.exports = selectMinistries;
