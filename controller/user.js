const User = require('../model/user');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.SignIn = (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const err = new Error('Validation failed!!!');
        err.statusCode = 400;
        throw err;
    }
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const role = req.body.role;
    User.findOne({email : email})
    .then(user => {
        if(user){
            const errors = new Error('User Already Exists. Try another email!!!');
            errors.statusCode = 401;
            throw errors
        }
        return bcrypt.hash(password, 12)
    })
        .then(hashedPass => {
            const loadeduser = new User({
                name: name,
                role: role,
                email: email,
                password: hashedPass
            });
            return loadeduser.save();
        })
        .then(result => {
            res.status(200).json({ message: 'User created successfully!!!', user: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.LogIn = (req, res, next) => {
    let loadeduser;
    let usersIdn ;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({  email })
        .then(user => {
            if (!user) {
                const err = new Error('User donot exist!!!');
                err.statusCode = 400;
                throw err;
            }
            loadeduser = user;
            usersIdn = user._id.toString();
            //console.log(usersIdn);
            return bcrypt.compare(password, loadeduser.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const err = new Error('Password donot match!!!');
                err.statusCode = 400;
                throw err;
            }
            const token = jwt.sign({
                email: loadeduser.email,
                userId: usersIdn,
            }, 'secret', { expiresIn: '1d' });
            console.log(token);
           
        })
        .then(result => {
            res.status(200).json({ message: 'User Successfully logged in!!!', user: loadeduser._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.ForgetPass = (req, res, next) => {
    const email = req.body.email;
    const otp = Math.floor(Math.random() * 10000);
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const err = new Error('User with email donot exist!!!');
                err.statusCode = 400;
                throw err;
            }
            console.log(otp);
            user.otp = otp;
            user.otpExpire = new Date().getTime() + 300 * 1000;
            var transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'nodetutcomplete@gmail.com',
                    pass: 'xhbksxdhbrkpqahw'
                }
            });
            var MailOption = {
                from: 'nodecompletetut@gmail.com',
                to: email,
                subject: 'Please donot share your otp with anyone.',
                text: `Your OTP is ${otp} . Please ignore if already seen.`
            }
            transport.sendMail(MailOption, ( error, info ) => {
                if(error) {
                    console.log(error);
                }
                res.status(200).json({ message: 'Email Sent successfully' });
            })
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'user otp saved !!!', otp: result.otp });
        })
}

exports.VerifyOtp = (req, res, next) => {
    const { email, otp } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const err = new Error('User with email donot exist!!!');
                err.statusCode = 400;
                throw err;
            }
            const time = new Date().getTime() * 1000;
            if (time < user.otpExpire) {
                res.status(400).json({ message: 'OTP expired!!!' });
            }
            else if (user.otp === otp) {
                res.status(200).json({ message: 'OTP verified!!!' });
            }
            else {
                const err = new Error('OTP donot match!!!');
                err.statusCode = 400;
                throw err;
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.resetPass = (req, res, next) => {
    let nuser;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const errors = new Error('User with email donot exist!!!');
                errors.statusCode = 400;
                throw errors;
            }
            nuser = user;

            return bcrypt.compare(password,user.password);
        })
        .then(isEqual => {
            if (isEqual) {
                const err = new Error('Password is same as the old password. Enter a new Password.!!!');
                err.statusCode = 400;
                throw err;
            }
            return bcrypt.hash(password, 12);
        })
        .then(hashedPass => {
            nuser.password = hashedPass;
            return nuser.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Password changed successfully!!!' });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}