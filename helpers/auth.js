module.exports = {
	ensureAuthenticated: function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		req.flash('err_msg', 'You are not authorized to access this page. Please login');
		res.redirect('/users/login');
	}
}