const db = require("../db");

async function selectMinistries() {
    const result = await db.query(
        `UPDATE ministries SET is_active = $1 WHERE name = ANY($2::text[]) RETURNING *`,
        [true, ["Ministry of Apples", "Ministry of Oranges"]],
    );

    console.log(result);

    if (result.rows.length === 0) {
        console.log("No ministries found.");
    } else {
        console.log(result.rows);
    }
}

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
