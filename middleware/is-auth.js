/*
middleware для защиты путей пользователя авторизованного.
*/
module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}