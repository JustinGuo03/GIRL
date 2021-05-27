const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const {v4: uuidv4} = require('uuid');

const router = require('./router');

const app = express();

const PORT = 3000;

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
    res.render('aboutus', {user: req.session.user});
})

//contact route
app.get('/contact', (req,res) => {
    res.render('contact', {user: req.session.user});
})

//login route
app.get('/login', (req,res) => {
    res.render('login');
})

//set up the server
app.listen(PORT, () => {
    console.log(`Listening to requests on http://localhost:${PORT}`);
})