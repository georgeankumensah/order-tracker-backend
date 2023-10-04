// Middleware to check if the user is logged in
function isAdmin(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.status(403).json({ error: "user is not authenticated" });
  }
  

  

  module.exports = isAdmin