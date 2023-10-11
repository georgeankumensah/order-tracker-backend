// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
	if (!req.session.user || !req.session.user.isAdmin) {
		res.status(403);
		throw new Error("Admin access required");
	}
	next();
}

function isSuperAdmin(req, res, next) {
	if (!req.session.user || !req.session.user.isSuperAdmin) {
		res.status(403);
		throw new Error("Super admin access required");
	}
	next();
}

module.exports = { isAdmin, isSuperAdmin };
