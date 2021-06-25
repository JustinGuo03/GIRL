const express   = require('express');
const router    = express.Router();
const User      = require('./models/User')

const AuthController = require('./controllers/AuthController')

router.post('/registration', AuthController.register)
router.post('/account', AuthController.login)
router.post('/confirm', AuthController.sendEmail)

// //login user
// router.post('/account', (req,res) => {
//     if(req.body.email == cred.email && req.body.password == cred.password){
//         req.session.user = cred.name;
//         res.redirect('/route/dashboard');
//     }else{
//         res.render('login',{failed: "Incorrect email or password"});
//     }
// })

// //register user
// router.post('/registration', (req,res) => {
//     if(req.body.email == cred.email){
//         res.render('register', {failed: "Email has already been registered"});
//     }else if(req.body.passone == req.body.passtwo){
//         req.session.user = req.body.name;
//         res.redirect('/route/dashboard');
//     }else{
//         res.render('register', {failed: 'Passwords do not match'});
//     }
// })

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

router.get('/destroy', (req,res) => {
    User.findOneAndDelete({email: req.session.email})
    .then(() => {
        req.session.destroy(function(err){
            if(err){
                console.log(err);
                res.send("Error");
            }else{
                res.render('index',{logout: "Account deleted successfully"});
            }
        })
    })
})

router.get('/emailsent', (req,res) => {
    res.render('emailsent')
})

module.exports = router;