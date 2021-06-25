const User      = require('../models/User')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')
const nodemailer= require('nodemailer')
require('dotenv').config()

//registers users
const register = (req,res,next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err) {
            res.json({
                error: err
            })
        }


        User.findOne({email:req.body.email})
        .then(user => {
            if(user){
                res.render('register',{failed: "User already registered"});
            }else{
                let user = new User ({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashedPass
                })
        
                user.save()
                .then(user => {
                    req.session.user = req.body.name;
                    req.session.email = req.body.email;
                    res.redirect('/route/dashboard');
                })
                .catch(error => {
                    res.json({
                        message: 'An error has occurred'
                    })
                })
            }
        })
    })
}

//logs in users
const login = (req,res,next) => {
    var email = req.body.email
    var password = req.body.password
    User.findOne({$or: [{email:email}, {phone:email}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(err) {
                    res.json({
                        error: err
                    })
                }
                if(result) {
                    req.session.email = user.email
                    req.session.user = user.name
                    res.redirect('/route/dashboard')
                }else{
                    res.render('login',{failed: "Password does not match"});
                }
            })
        }else{
            res.render('login', {failed: "User not found"});
        }
    })
}

const sendEmail = (req, res, next) => {
    var email = req.body.email
    User.findOne({$or: [{email:email}, {phone:email}]})
    .then(user => {
        if(user) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                    clientId: process.env.OAUTH_CLIENTID,
                    clientSecret: process.env.OAUTH_CLIENT_SECRET,
                    refreshToken: process.env.OAUTH_REFRESH_TOKEN
                }
            });

            const mailOptions = {
                from: 'gaminginirl@gmail.com',
                to: req.body.email,
                subject: 'Reset Password for Gaming IRL',
                html: '<h1>Reset your password by clicking the link below!</h1><a href="http://localhost:3000/route/resetpass">Reset Password</a>'
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                res.redirect('/route/emailsent');
                }
            });
        }
    })
}

module.exports = {
    register, login, sendEmail
}