function validateObjectKeys(data, expectedKeys, label = "Data") {
    if (!data || typeof data !== "object") {
        console.error(`${label} must be a valid object.`);
        return false;
    }

    const actualKeys = Object.keys(data);

    if (actualKeys.length !== expectedKeys.length) {
        console.error(
            `${label} does not include appropriate keys. Expected [${expectedKeys.join(", ")}], but received [${actualKeys.join(", ")}]`,
        );
        return false;
    }

    const isValid = expectedKeys.every((key) => actualKeys.includes(key));

    if (!isValid) {
        console.error(
            `${label} does not include appropriate keys: ${JSON.stringify(data)}`,
        );
        return false;
    }

    return true;
}

const MINISTRY_KEYS = ["name", "nepali_name", "code"];
const USER_KEYS = ["username", "password", "first_name", "last_name", "email"];

function ministryKeyValidation(ministryData) {
    return validateObjectKeys(ministryData, MINISTRY_KEYS, "Ministry data");
}

function userKeyValidation(userData) {
    return validateObjectKeys(userData, USER_KEYS, "User data");
}

module.exports = {
    validateObjectKeys,
    ministryKeyValidation,
    userKeyValidation,
};
