const Order = require('../models/order');
const Cart = require('../models/cart');


/* 
Получем заказы пользователя
*/
exports.getOrders = (req, res, next) => {
    try {
        const orders = await Order.find({
            userId: req.session.user._id
        });

        res.render();
    } catch (err) {
        if (!err.errorCode) {
            err.errorCode = 500;
        }
        next(err);
    }
}

exports.postOrder = (req, res, next) => {

}
/*
получаем корзину пользователя
*/
exports.getCart = async (req, res, next) => {
    try {
        const cart = await req.session.user.populate('cart.items.productId');
        const products = user.cart.items;
        console.log(products);
        res.redirect('/');
    } catch (err) {
        if (!err.errorCode) {
            err.errorCode = 500;
        }
        next(err);
    }
}

exports.addToCart = (req, res, next) => {

}