const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin');
const isAdminAuth = require('../middleware/is-admin-auth');

router.get('/adminpage', isAdminAuth, controller.getAdminPage);
router.get('/create/:productId', isAdminAuth, controller.getEditProduct);
router.get('/create', isAdminAuth, controller.getCreate);
router.post('/create', isAdminAuth, controller.postCreate);
router.get('/login', controller.getLogin);
router.post('/login', controller.postLogin);
router.post('/update', isAdminAuth, controller.postEditProduct);
router.post('/delete', isAdminAuth, controller.postDelete);


module.exports = router;