const User = require("../schemas/User.schema");
const asyncHandler = require("express-async-handler");

const user = asyncHandler(async (req, res, next) => {
	if (!req?.session?.user) {
		res.status(401);
		throw new Error("User not authorized");
	}
	let response = await User.findOne({ _id: req.session.user._id });
	if (!response) {
		await req.session.destroy();
		res.status(401);
		throw new Error("User not authorized");
	}

	req.session.user = response;
	next();
});

module.exports = user;
