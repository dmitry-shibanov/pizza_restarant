const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mogoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

//routes
const routesPizza = require('./routes/pizza');
const auth = require('./routes/user');
const routesAdmin = require('./routes/admin');

//models
const Admin = require('./models/admin');
const User = require('./models/user');

//controllers
const errorController = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


const MongoDbUri = 'mongodb+srv://DimaSh:7589643210D@cluster0-xbxfn.mongodb.net/pizzeria?retryWrites=true';
//создаем хранилище для session
const store = new MongoDBStore({
    uri: MongoDbUri,
    collection: 'sessions',
});

//skumbria
const csrfProtection = csrf();

//инициализация конфигурации нашей session
app.use(session({
    name: 'skumbria',
    saveUninitialized: false,
    resave: false,
    secret: 'my secret skumria',
    store: store
}));


app.use(csrfProtection);
app.use(flash());

//session для пользователя
app.use(async (req, res, next) => {
    try {
        if (!req.session.user) {
            console.log('User is not logged in')
            next();
        }
        console.log(req.session.user._id);
        const user = await User.findById(req.session.user._id);
        if (!user) {
            const err = new Error("Пользователь udefined");
            err.errorCode = 404;
            throw err;
        }
        req.user = user;
        next();

    } catch (err) {
        if (!err.errorCode) {
            err.errorCode = 500;
        }
        next(err);
    }
});

//session fro admin
app.use(async (req, res, next) => {
    if (!req.session.admin) {
        console.log('Admin is not logged in')
        next();
    }
    console.log(req.session.admin._id);
    try {
        const admin = await Admin.findById(req.session.admin._id);
        if (!admin) {
            const err = new Error('Администратор undefined');
            err.errorCode = 404;
            throw err; 
        }
        req.admin = admin;
        next();
    } catch (err) {
        if (!err.errorCode) {
            err.errorCode = 500;
        }
        next(err);
    }
});
//хранение данных для все путей
app.use((req, res, next) => {
    console.log("came to locals");
    res.locals.authenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

//инициализация путей
app.use(routesPizza);
app.use(auth);
app.use('/admin', routesAdmin);
app.use(errorController.get404);

app.use((err,req,res,next)=>{
    res.render();
});


//соединение с moongodb запуск сервера
mogoose.connect(MongoDbUri).then(result => {
    app.listen(3500);
}).catch(err => console.log(err));
