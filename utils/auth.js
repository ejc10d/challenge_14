const withAuth = (req, res, next) => {
    if (!req.session.signed_in) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = withAuth;
