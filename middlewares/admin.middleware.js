// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
      return next();
    }
    res.status(403).json({ error: "Admin access required" });
  }
  

  

  module.exports = isAdmin