const db = require("../db");
const validation = require("../helpers/validations");
const password = require("../helpers/password");
const Query = require("../lib/query");

const data = [
    {
        merging: ["Ministry of Apples", "sujit test ministry"],
        to: {
            user: {
                username: "JohnDoe112",
                password: "helloworld",
                first_name: "John",
                last_name: "Doe",
                email: "johndoe112@gmail.com",
            },
            ministry: {
                name: "Ministry of fruits",
                nepali_name: "Ministry of fruits NE",
                code: `code-${new Date().getTime()}`,
            },
        },
    },
];

async function ministryMerger(mergerConfig) {
    if (!mergerConfig.length) {
        console.error("Merger config is empty");
        return;
    }

    for (const [idx, merger] of mergerConfig.entries()) {
        //TODO: Run data validations here first

        if (!Array.isArray(merger.merging)) {
            console.log(`[Index ${idx}] Error merging: ${merger.merging}`);
            console.error("Merging data must be an array");
            return;
        }
        if (!validation.ministryKeyValidation(merger.to.ministry)) {
            console.log(`[Index ${idx}} Error ministry: ${merger.to.ministry}`);
            console.error("Merging data must be valid");
            return;
        }
        if (!validation.userKeyValidation(merger.to.user)) {
            console.log(`[Index ${idx}] Error user: ${merger.to.user}`);
            console.error("User data must be valid");
            return;
        }

        const { user, ministry } = merger.to;

        // MUST: Have to run it all under a single transaction

        // 1) Create new ministry i.e an entry for the
        console.log(`[Executing ${idx}]: Quering to create new ministry`);
        const result1 = await Query(
            `INSERT INTO ministries (name, nepali_name, code)
           VALUES ($1, $2, $3)
           RETURNING *;`,
            [ministry.name, ministry.nepali_name, ministry.code],
            merger,
        );
        if (result1.rows.length)
            console.log(`[Success ${idx}]: New ministry created successfully`);

        const newMinistry = result1.rows[0];
        const newMinistryId = newMinistry.id;

        // 2) Disable the one those were merged
        console.log(`[Executing ${idx}]: Disabling old ministries`);
        const result2 = await Query(
            `UPDATE ministries SET is_active = $1 WHERE name = ANY($2::text[]) RETURNING *`,
            [false, merger.merging],
        );
        if (result2.rows.length)
            console.log(`[Success ${idx}]: Disabled all ministries`);

        const disabledMinistryIds = result2.rows.map((row) => row.id);
        console.log("Ministries being disabled", disabledMinistryIds);

        // 3) Set the the previous ministry admins status to inactive and ministry_id to null
        // PLUS
        // Create new user who will be ministry admin for the newly created department

        console.log(
            `[Executing ${idx}]: Making previous ministry's admins inactive`,
        );
        const result3_1 = await Query(
            `
          UPDATE users SET status = $1 WHERE ministry_id = ANY($2::int[]) RETURNING *
        `,
            ["inactive", disabledMinistryIds],
        );
        if (result3_1.rows.length)
            console.log(`[Success ${idx}]: Previous ministries made inactive`);

        const hashedPassword = await password.saltHashPassword(user.password);

        console.log(
            `[Executing ${idx}]: Creating new user to be the new ministry's admin`,
        );
        const result3_2 = await Query(
            `
            INSERT INTO users (ministry_id, username, password, first_name, middle_name, last_name, email, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `,
            [
                newMinistryId,
                user.username,
                hashedPassword,
                user.first_name,
                user.middle_name ?? null,
                user.last_name,
                user.email,
                "ministryAdmin",
            ],
        );
        if (result3_2.rows.length)
            console.log(`[Success ${idx}]: New ministry admin created`);

        const newMinistryAdmin = result3_2.rows[0];
        const newMinistryAdminsId = newMinistryAdmin.id;

        // 4) Transfer all the projects ownership to the new ministry and update the depart_id in those projects to be null
        console.log(
            `[Executing ${idx}]: Transfering projects ownership to new ministry`,
        );
        const result4 = await Query(
            `UPDATE gates
           SET ministry_id = $1, department_id = $2, creator_id = $3
           WHERE ministry_id = ANY($4::int[])
           RETURNING *`,
            [newMinistryId, null, newMinistryAdminsId, disabledMinistryIds],
        );
        console.log(
            `[Success: ${idx}]: Transfering projects ownership to new ministry`,
        );
    }
}

if (require.main === module) {
    (async () => {
        try {
            await ministryMerger(data);
        } catch (err) {
            console.error("Error running script:", err);
        } finally {
            await db.pool.end();
            console.log("Database pool closed.");
        }
    })();
}

module.exports = ministryMerger;
