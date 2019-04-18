// Check if the user is logged in, if not redirect to login page
module.exports = {
	ensureAutenticated: function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		req.flash('error_msg', 'please log in to view this resourse');
		res.redirect('/users/login');
	}
}