const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userServices = require("../../services/users");

async function checkPassword(password, encryptedPassword) {
	return await bcrypt.compareSync(password, encryptedPassword)
}

function createToken(payload) {
	return jwt.sign(payload, process.env.JWT_PRIVATE_KEY || "Token");
}

module.exports = {
	async authorize(req, res, next) {
		try {
			if (!req.headers.authorization) {
				res.status(401).json({
					status: "Failed",
					message: "Insert Token!"
				});
				return
			}

			const token = req.headers.authorization.split("Bearer ")[1];
			const tokenPayload = jwt.verify(
				token,
				process.env.JWT_PRIVATE_KEY || "Token"
			);

			req.user = await userServices.get(tokenPayload.id);

			next();
		} catch (err) {
			res.status(401).json({
				error: err.message,
				message: "Unauthorized."
			});
		}
	},

	async register(req, res) {
		try {
			const password = req.body.password
			const encryptedPassword = await bcrypt.hash(password, 10)

			const user = await userServices.create({
				name: req.body.name,
				email: req.body.email.toLowerCase(),
				encryptedPassword,
				photo: null,
    		phoneNumber: null,
    		address: null,
    		cityId: null,
			});

			res.status(201).json({
				id: user.id,
				name: user.name,
				email: user.email,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			});
		} catch (err) {
			res.status(400).json({
				status: "Failed",
				message: err.message
			});
		}
	},

	async login(req, res) {
		try {
			const email = req.body.email.toLowerCase();
			const password = req.body.password;

			const user = await userServices.getOne({
				where: {
					email
				},
			});

			if (!user) {
				res.status(404).json({
					status: "Failed",
					message: "Email not found!"
				});
				return
			}

			const isPasswordCorrect = await checkPassword(password, user.encryptedPassword)

			if (!isPasswordCorrect) {
				res.status(401).json({
					status: "Failed",
					message: "Password is incorrect!"
				});
				return;
			}

			const token = createToken({
				id: user.id,
				name: user.name,
				email: user.email,
			}, process.env.JWT_PRIVATE_KEY || 'Token', {
				expiresIn: '1h'
			});

			res.status(201).json({
				id: user.id,
				name: user.name,
				email: user.email,
				token,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			});
		} catch (err) {
			res.status(401).json({
				status: "Failed",
				message: err.message
			});
		}
	},

	async updateDetail(req, res) {
		try {
			const {
				photo,
				phoneNumber,
				address,
				cityId
			} = req.body
			const id = req.params.id;
			const compareId = id.toString() === req.user.id.toString();
			if (!compareId) {
				res.status(401).json({
					status: "FAIL",
					message: "User who can edit or delete user data is him/herself."
				});
				return;
			}
			userServices.update(req.params.id, {
				photo,
				phoneNumber,
				address,
				cityId,
			})
			res.status(200).json({
				status: "OK",
				message: `User with id ${req.params.id} has been updated.`,
			});

		} catch (err) {
			res.status(422).json({
				status: "FAIL",
				message: err.message,
			});
		}
	},

	async whoAmI(req, res) {
		try {
			res.status(200).json(req.user);
		} catch (err) {
			res.status(401).json({
				status: "FAIL",
				message: err.message,
			});
		}
	},

	async getUser(req, res) {
    try{
		const user = await userServices.get(req.params.id)

		if (!user) {
			res.status(404).json({
				status: "FAIL",
				message: `User with id ${req.params.id} not found!`,
			});
			return
		}

		res.status(200).json(user);
  } catch (err){
    res.status(401).json({
      status: "FAIL",
      message: err.message,
    });
  }
	},

	async getAllUsers(req, res) {
		try {
			const getAll = await userServices.list();

			res.status(200).json({
				status: "success",
				data: getAll
			})
		} catch (err) {
			res.status(400).json({
				status: "FAIL",
				message: err.message
			})
		}
	},
};