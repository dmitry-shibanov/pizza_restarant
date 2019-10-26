/*
middleware для защиты путей админа.
*/
module.exports = (req, res, next) => {
    console.log(req.session.isLoggedInAdmin)
    if (!req.session.isLoggedInAdmin) {
        return res.redirect('/admin/login');
    }
    next();
}