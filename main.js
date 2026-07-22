const db = require("./db");
const ministryMerger = require("./scripts/ministry-merger");

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
// con also directly run the script using ```node ./scripts/ministry-merger.js```
async function main() {
    try {
        console.log("\n--- Running select-ministries script ---");
        ministryMerger(data);
    } catch (error) {
        console.error("Error during main execution:", error);
    } finally {
        await db.pool.end();
        console.log("Database connection pool closed.");
    }
}

main();
