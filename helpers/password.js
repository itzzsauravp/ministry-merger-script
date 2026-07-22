const crypto = require("crypto");

let sha512 = (password) => {
    let hash = crypto.createHash("md5");
    /** Hashing algorithm sha512 */
    let value = hash.update(password).digest("hex");
    return {
        passwordHash: value,
    };
};

function saltHashPassword(password) {
    return new Promise((resolve, reject) => {
        let passwordData = sha512(password);
        if (passwordData.passwordHash) {
            resolve(passwordData.passwordHash);
        } else {
            reject(new Error("Unable to hash the password."));
        }
    });
}

module.exports = {
    saltHashPassword,
};
