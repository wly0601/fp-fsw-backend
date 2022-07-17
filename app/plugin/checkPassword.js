const bcrypt = require("bcryptjs");

async function checkPassword(password, encryptedPassword) {
	return await bcrypt.compareSync(password, encryptedPassword);
}

module.exports = checkPassword;