module.exports = {
	getRoot(req, res){
		res.status(200).json({
			status: "OK",
			message: "Second Hand API is up and running!",
		});
	},
}