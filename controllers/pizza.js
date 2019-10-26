const Product = require('../models/pizza');


/*
    Получаем все пиццы, что у нас в бд
*/
exports.getAllpizza = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('pizzaria/pizza-all', { prods: products, authenticated: req.session.isLoggedIn });
    } catch{
        if (!err.errorCode) {
            err.errorCode = 500;
        }
        next(err);
    }
}


/*
подучаем пиццу по ее id
*/
exports.getPizzaDescription = async (req, res, next) => {
    const pizzaId = req.params.pizzaId;

    try {
        const product = await Product.findById(pizzaId);
        if (!product) {
            const err = new Error("Пиццы с таким id не существует");
            err.errorCode = 404;
            next(err);
        }

        res.render('pizzaria/pizza-desc', { PageTitle: pizza, product: product, authenticated: req.session.isLoggedIn });
    } catch (err) {
        if (!err.errorCode) {
            err.errCode = 500;
        }
        next(err);
    }
}

/*
получеам главную страницу
*/
exports.getIndex = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('index', { authenticated: req.session.isLoggedIn, items: products });
    } catch (err) {
        if (!err.errorCode) {
            err.errorCode = 500;
        }
        next(err);
    }
}