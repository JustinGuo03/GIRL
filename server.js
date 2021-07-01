const express       = require('express');
const mongoose      = require('mongoose');
const morgan        = require('morgan');
const path          = require('path');
const bodyparser    = require('body-parser');
const session       = require('express-session');
const {v4: uuidv4}  = require('uuid');
const url           = require('url')

const router        = require('./router');
const AuthController = require('./controllers/AuthController');
const { query } = require('express');
const { token } = require('morgan');

mongoose.connect('mongodb://localhost:27017/accountsdb', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection
db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database Connection Established!')
})

const app = express();

app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));

app.use('/route', router);

app.set('view engine', 'ejs');

//load static assets
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/images')));

//home route
app.get('/', (req,res) => {
    res.render('index', {user: req.session.user});
})

//softskills route
app.get('/softskills', (req,res) => {
    res.render('skills', {user: req.session.user});
})

//aboutus route
app.get('/aboutus', (req,res) => {
    console.log('called aboutus');
    res.render('aboutus', {user: req.session.user});
})

//team route
app.get('/team', (req,res) => {
    res.render('team', {user: req.session.user});
})

//login route
app.get('/login', (req,res) => {
    res.render('login');
})

//register route
app.get('/register', (req,res) => {
    res.render('register');
})

//send password reset email route
app.get('/sendemail', (req,res) => {
    res.render('sendemail');
})

app.get('/passwordReset', (req,res) => {
    let queryObject = url.parse(req.url, true).query;
    //req.session.token = queryObject.token;
    if(AuthController.resetPass(queryObject.token, queryObject.id)){
        let link = '/route/reseting?id='+queryObject.id;
        res.render('resetpass', {link: link});
    }else{
        res.render('invalidtoken');
    }
})

const PORT = 3000;

//set up the server
app.listen(PORT, () => {
    console.log(`Listening to requests on http://localhost:${PORT}`);
})
