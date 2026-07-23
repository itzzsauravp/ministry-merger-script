const fs = require("fs/promises");
const path = require("path");

function normalizeError(err) {
    console.log("This is the main error: ", err);
    if (typeof err === "string") {
        try {
            return JSON.parse(err);
        } catch {
            return err;
        }
    }

    if (err instanceof Error) {
        return {
            message: err.message,
            code: err.code,
            detail: err.detail,
            table: err.table,
            constraint: err.constraint,
            stack: err.stack,
        };
    }

    return err;
}

async function logError(
    { data, query, error },
    logDir = "./logs",
    fileName = "error.json",
) {
    const timestamp = new Date().toISOString();

    const cleanedQuery =
        typeof query === "string" ? query.replace(/\s+/g, " ").trim() : query;

    const logPayload = {
        timestamp,
        data: data ?? null,
        query: cleanedQuery || "",
        error: normalizeError(error),
    };

    // console.error(`\n[ERROR LOG] ${timestamp}`);
    // console.error(` Query: ${logPayload.query}`);
    if (typeof logPayload.error === "object") {
        // console.dir({ error: logPayload.error }, { depth: null, colors: true });
    } else {
        // console.error(` Error: ${logPayload.error}`);
    }

    try {
        const resolvedDir = path.resolve(logDir);
        const filePath = path.join(resolvedDir, fileName);

        await fs.mkdir(resolvedDir, { recursive: true });

        const logLine = JSON.stringify(logPayload, null, 2) + "\n";

        await fs.appendFile(filePath, logLine, "utf8");
    } catch (fsErr) {
        console.error("Failed to write to log file:", fsErr.message);
    }
}

module.exports = { logError };
