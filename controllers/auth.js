const User = require("../models/user");
const bcrypt = require('bcryptjs');


exports.register = (req, res) => {
    res.render('users/regestration', { authenticated: false });
};

// Post registration
/*
Сначало проверяется если пользователь с данным email уже в бд, если
есть то нельзя, если да то создаем пользователя хешируя его пароль
*/
exports.postSignUp = async (req, res) => {
    const username = req.body.login;
    const password = req.body.password1;
    const password2 = req.body.password2;
    const email = req.body.mail;
    try {
        const user = await User.findOne({
            email: email
        });
        if (user) {
            req.flash('error', 'пользователь с такой почтой уже есть');
            return res.redirect('/');
        }
        const passwordHashed = await bcrypt.hash(password, 12);
        if (!password) {
            const err = new Error("Ошибка в пароле");
            return next(err);
        }
        const user_save = new User({
            password: passwordHashed,
            name: username,
            email: email
        });
        const result = await user_save.save();

        if (!result) {
            const err = new Error("Ошибка на сервере пользователь не сохранен");
            return next(err);
        }

        res.redirect('/login');
    } catch (err) {
        if (!err.errorCode) {
            err.errorCode = 500;
        }
    }
};


exports.getLogIn = (req, res, next) => {
    res.render('users/login');
}
/*
Пользователь выполняет вход сначало проверяем email потом через bcrypt.js 
сравниваем наши пароли и потом выполняем вход
*/
exports.postLogIn = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('user login: but user is undefined');
            req.flash("error", "Пользователя с данной почтой нет")
            return res.redirect('/login');
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            console.log('user login: but password is not equal');
            req.flash("error", "Неверный пароль");
            return res.redirect('/login');
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => {
            console.log(err);
            res.redirect('/');
        });
    } catch (err) {
        err.errorCode = 500;
        next(err);
    }
}

/*
выход пользователя из session
*/
exports.postLogOut = (req, res, next) => {
    console.log('came to logout')
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}





