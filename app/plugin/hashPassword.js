const bcrypt = require("bcryptjs");

async function hashPassword(password, SALT){
	return await bcrypt.hash(password, SALT);
}

module.exports = hashPassword;