const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const securePassword = async(password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

        
    } catch (error) {
        console.log(error.message);
    };
};

const loadRegister = async (req, res) => {
    try {

        res.render('registration')
        
    } catch (error) {
        console.log(error.message);
    };
};

const insertUser = async(req, res) => {
    try {

        if (req.body.name == '' && req.body.email == '' && req.body.number == '' && req.body.password == '') {
            res.render('registration')
        } else if (req.body.name == '') {
            res.render('registration', {alert: 'Enter Name of the User'})
        } else if (req.body.email == '') {
            res.render('registration', {alert: 'Enter Email of the User'})
        } else if (req.body.number == '') {
            res.render('registration', {alert: 'Enter Mobile Number of the User'})
        } else if (req.body.password == '') {
            res.render('registration', {alert: 'Enter Role of the User'})
        } else if (req.body.name.length < 4) {
            res.render('registration', {alert: 'Minimum length of Name : 5'})
        } else if (req.body.name.length >= 25) {
            res.render('registration', {alert: 'Maximum length of Name : 25'})
        } else if (req.body.name[1] == ' ') {
            res.render('registration', {alert: 'Invalid Name Syntax'})
        } else if (req.body.number.length !== 10) {
            res.render('registration', {alert: 'Invalid Mobile Number'})
        } else if (req.body.password[1] == ' ') {
            res.render('registration', {alert: 'Invalid Password Syntax'})
        } else if (req.body.password.length < 4) {
            res.render('registration', {alert: 'Minimum length of Password : 5'})
        } else if (req.body.password.length >= 12) {
            res.render('registration', {alert: 'Maximum length of Password : 12'})
        } else {
            const sPassword = await securePassword(req.body.password);

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                number: req.body.number,
                password: sPassword,
                is_admin: 0,
            });

            const userData = await user.save()

            if (userData) {
                res.render('registration',{message: "Registration Successfull"});
            } else {
                res.render('registration',{message: "Your Registration Has Been Failed"});
            }
        }
    }
    catch (error) {
        console.log(error.message);
    };
};

// Login User Methods

const loginLoad = async(req, res) => {
    try {
        res.render('login');

    } catch (error) {
        console.log(error.message);
    }
};

const verifyLogin = async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({
            email: email
        });

        if (userData) {
            
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                if (userData.is_verified === 0) {
                    res.render('login', {message: 'Please Verify Your EMail.'});
                }else {
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }
            } else {
                res.render('login', {message: 'Password is incorrect'});
            };

        } else {
            res.render('login', {message: 'Email and Password is Incorrect'});
        };

    } catch (error) {
        console.log(error.message);
    };
};

const loadHome = async(req, res) => {
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message)
    }
};

const userLogout = async(req, res) => {
    try {
        
        req.session.destroy();
        res.redirect('/');

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
};