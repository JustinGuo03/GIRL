const User      = require('../models/User')
const crypto    = require('crypto')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')
const nodemailer= require('nodemailer')
const Token     = require('../models/Token')
const url       = require('url')
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
    User.findOne({email:email})
    .then(user => {
        if(user){
            req.session.email = req.body.email;
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
                    res.render('login',{failed: "Email or Password Incorrect"});
                }
            })
        }else{
            res.render('login', {failed: "Email or Password Incorrect"});
        }
    })
}

const sendEmail = (req, res, next) => {
    var email = req.body.email
    User.findOne({email:email})
    .then(user => {
        if(user) {
            let resetToken = crypto.randomBytes(32).toString("hex");
            const hash = bcrypt.hash(resetToken, 10);

            new Token({
                userId: user._id,
                token: hash,
                createdAt: Date.now()
            })

            const link = `http://localhost:3000/passwordReset?token=${resetToken}&id=${user._id}`;

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
                html: `<h1>Reset your password by clicking the link below!</h1><a href=${link}>Reset Password</a>`
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                res.redirect('/route/emailsent');
                }
            });
        }else{
            res.render('sendemail', {failed: "User not found"});
        }
    })
}

const resetPass = (token, userId) => {
    let passwordResetToken = Token.findOne({ userId });
    if (!passwordResetToken) {
        return;
    }

    const isValid = bcrypt.compareSync(token, passwordResetToken.token);
    if (!isValid) {
        return;
    }

    // const hash = bcrypt.hash(password, Number(bcryptSalt));
    // User.updateOne(
    //     { _id: userId },
    //     { $set: { password: hash } },
    //     { new: true }
    // );

    passwordResetToken.deleteOne();
    return true;
};

const reseting = (req, res) => {
    
    let queryObject = url.parse(req.url, true).query;

    if(req.body.firstpass === req.body.secondpass) {
        bcrypt.hashSync(req.body.firstpass, 10, function(err, hashedPass){
            if(err) {
                res.json({
                    error: err
                })
            }

            console.log('hash' + hashedPass);

            User.updateOne(
                {_id: queryObject.id}, 
                {$set: {password: hashedPass}}, 
                {new: true}
            );
            res.redirect('/route/reset')
        })
    }else{
        let link = '/route/reseting?id='+queryObject.id;
        res.render('resetpass',{failed: "Password does not match", link: link});
    }
}

module.exports = {
    register, login, sendEmail, resetPass, reseting
}