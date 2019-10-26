const express = require('express');
const router = express.Router();
const pizzaCont = require('../controllers/pizza');


router.get('/', pizzaCont.getIndex);
router.get('/pizza-all/:pizzaId', pizzaCont.getPizzaDescription);
router.get('/pizza-all', pizzaCont.getAllpizza);

// router.get('pizza-all/dishes/');

module.exports = router;