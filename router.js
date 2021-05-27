var express = require('express');
var router = express.Router();

const cred = {
    email: "justing1618@gmail.com",
    password: 'just',
    name: 'Justin'
}

//login user
router.post('/account', (req,res) => {
    if(req.body.email == cred.email && req.body.password == cred.password){
        req.session.user = cred.name;
        res.redirect('/route/loggedin');
    }else{
        res.render('login',{failed: "Incorrect email or password"});
    }
})

//route for login
router.get('/loggedin', (req,res) => {
    if(req.session.user){
        res.render('dashboard', {user: req.session.user})
    }else{
        res.send('Unauthorized User')
    }
})

//route for dashboard
router.get('/dashboard', (req,res) => {
    if(req.session.user){
        res.render('dashboard', {user: req.session.user})
    }else{
        res.send('Unauthorized User')
    }
})

//route for logout
router.get('/logout', (req,res) => {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error");
        }else{
            res.render('index',{logout: "Logged out successfully"});
        }
    })
})

module.exports = router;