const Product = require('../models/pizza');
const Order = require('../models/order');
/*
Получить корзину пользователя и заполнить ее данными через populate по id
*/
exports.getCart = (req, res, next) => {

    req.user.populate('cart.items.productId').execPopulate().then(user => {
        const items = user.cart.items.map(i => {
            return { quantity: i.quantity, product: { ...i.productId._doc } };
        });
        console.log(items);
        res.render('users/cart', { items: items });
    })
}

exports.getOrder = (req, res, next) => {

}


exports.getProfile = (req, res, next) => {
    res.render('users/profile');
}

/*
Добавление в корзину продукта, проверяется что находится в корзине,
если продукт есть то увеличиваем его количество инче просто добавляем в корзину
*/

exports.postAddtoCart = (req, res, next) => {
    const productId = req.body.productId;
    const user = req.user;

    Product.findById(productId).then(product => {
        console.log(product);
        return user.addToCart(product);
    }).then(result => {
        console.log(result);
        res.redirect('/pizzaria/pizza-all');
    }).catch(err => console.log(err));

}
/*
Создает заказ для пользователя
*/
exports.postMakeOrder = (req, res, next) => {
    const user = req.user;
    now = new Date();
    let totalPrice = 0;
    user.populate('cart.items.productId').execPopulate().then(user => {
        const products = user.cart.items.map(i => {
            return { quantity: i.quantity, product: { ...i.productId._doc } };
        });
        console.log(products);

        let totalPrice = 0;

        products.forEach(item => {
            totalPrice += item.product.price;
        });



        order = new Order({
            time: now,
            price: totalPrice,
            products: products,
            user: {
                email: user.email,
                userId: user._id
            }

        });
        order.save();
    })
}

/*
Удаляем из корзины продукт
*/
exports.postRemoveCart = (req, res, next) => {
    const productId = req.body.productId;
    const user = req.session.user;
    user.removeFromCart(productId).then(result => {
        console.log(result);
        res.redirect('/');
    });
}
/*
очищаем корзину
*/
exports.postClearCart = (req, res, next) => {
    const user = req.session.user;
    user.clearCart().then(result => {
        res.redirect('/');
    })
}