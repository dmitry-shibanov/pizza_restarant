const Product = require('../models/pizza');
const Admin = require('../models/admin');
const Order = require('../models/order');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
/* 
обработчик получения adinpage подгружается данные,
через модель Product мы загружаем все продукты на страницу, через Order все заказы, а
через User всех пользователей 
*/
exports.getAdminPage = async (req, res, next) => {

    // try{
    //     const products = await Product.find();
    //     // if(products.length == 0){
    //     //     const err = new Error("Нет товаров");
    //     //     return next(err);
    //     // }
    // }catch(err){

    // }

    Product.find().then(products => {
        Order.find().then(orders => {
            User.find().then(users => {
                console.log(orders);
                res.render('admin/admin_page', { items: products, users: users, orders: orders });
            })
        })
    }).catch(err => {
        console.log(err);
    });
}
/*
Создание продукта пользователь вводит цену, имя, описание,
потом создаем объект Product вызываем save, потом отправляем код
для того чтобы остаться на этой же станице
*/
exports.postCreate = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    product = new Product({
        name: name,
        price: price,
        description: description,
        imageUrl: imageUrl
    });

    product.save().then(result => {
        console.log('По сути создан');
        res.status(204).send();
    }).catch(err => {
        console.log(err);
    });
}

/* 
Получаем страницу создания продукта
*/
exports.getCreate = (req, res, next) => {
    res.render('admin/create_product', { action: false });
}
/*
Выполняем логин сначало проверяем, если пользователь с данным email, а
потом введется проверка пароля, пароль проверяется через бибилиотеку bcrypt.js
так как пароли хешировали через нее
*/
exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    // bcrypt.hash(password,12).then(passwordHash=>{
    //     admin = Admin({
    //         email: email,
    //         password: passwordHash
    //     });
    //     admin.save().then(result => {
    //         res.redirect('/');
    //     })
    // })

    Admin.findOne({
        email: email
    }).then(user => {
        if (!user) {
            console.log('user is undefined')
            req.flash('error', 'Ошибка');
            return res.redirect('/')
        }

        bcrypt.compare(password, user.password).then(result => {
            console.log(`result ${result}`);
            if (result) {
                console.log('result is true');
                req.session.isLoggedIn = true;
                req.session.isLoggedInAdmin = true;
                req.session.admin = user;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            req.flash('error', 'Ошибка');
            res.redirect('/')
        }).catch(err => {
            console.log(err);
            res.redirect('/');
        });

    }).catch(err => {
        console.log(err);

    });
}
/* 
получаем страницу для входа
*/
exports.getLogin = (req, res, next) => {
    res.render('admin/login');
}
/*
 получеам id нашего продукта и получаем его через id и заполняем ими форму
 */
exports.getEditProduct = async (req, res, next) => {
    const productId = req.params.productId;
    try {
        const product = Product.findById(productId);
        if (!product) {
            const err = new Error("Продукт не найден");
            err.errorCode = 404;
            throw err;
        }

        res.render('admin/create_product', { action: true, product: product });
    } catch (err) {
        if (!err) {
            err.errorCode = 500;
        }
        next(err);
    }
}
/* 
    находим наш продукт переприсваиваем ему свойства, а потом 
    выполняем save.
*/
exports.postEditProduct = async (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.name;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    console.log(prodId);
    try {
        const product = await Product.findById(prodId);
        if (!product) {
            const err = new Error("Такой пиццы нет");
            err.errorCode = 404;
            throw err;
        }

        product.name = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
        result = await product.save();
        if (!result) {
            const err = new Error("Ошибка на сервере во время редактирования продукта");
            throw err;
        }

        product.save();
        return res.status(201).send();

    } catch (err) {
        if (!err.errorCode) {
            err.errorCode = 500;
        }
        next(err);
    }
}


/*
получаем id нашего проекта и переходим на нашу страницу
*/
exports.postDelete = async (req, res, next) => {
    const productId = req.body.productId;
    console.log(`Admin delete Product ${productId}`);
    try {
        const product = await Product.deleteOne({
            _id: productId
        });
        if (!product) {
            const err = new Error("Не удалось удалить продукт");
            throw err;
        }

        res.status(200).send();
    } catch (err) {
        if (!err.errorCode) {
            err.errorCode = 500;
        }
        next(err);
    }
}
