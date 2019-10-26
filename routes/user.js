const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const user = require('../controllers/users');
const isAuth = require('../middleware/is-auth');


router.get('/regestration', auth.register);
router.post('/regestration', auth.postSignUp);
router.get('/login', auth.getLogIn);
router.post('/login', auth.postLogIn);
router.post('/logout', auth.postLogOut);
// router.post('regestration/');
// router.post('order/');
// router.get('list-orders/');
router.get('/cart', isAuth, user.getCart);
router.post('/cart', isAuth, user.postAddtoCart);
router.get('/profiler', isAuth, user.getProfile);
router.post('/makeOrder', isAuth, user.postMakeOrder);

module.exports = router;