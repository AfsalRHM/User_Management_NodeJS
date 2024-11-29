const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const securePassword = async(password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

        
    } catch (error) {
        console.log(error.message);
    };
}

const loadLogin = async(req, res) => {
    try {

        res.render('login');

    } catch (error) {
        console.log(error);
    }
}

const verifyLogin = async(req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        if (email == '') {
            res.render('login', {message: 'Enter Email'});

        } else if (password == '') {
            res.render('login', {message: 'Enter Password'});
        }
        else {

            const userData = await User.findOne({email: email});

            if (userData) {

                const passwordMatch = bcrypt.compare(password, userData.password);

                if (passwordMatch) {

                    if (userData.is_admin === 0) {
                        res.render('login', {message: 'Invalid Login - Not Admin'});
                    } else {
                        req.session.user_id = userData._id;
                        res.redirect('/admin/home');
                    }

                } else {
                    res.render('login', {message: 'Password Is Incorrect'});
                }

            } else {
                res.render('login', {message: 'No User Found in the Email'});
            };

        };

    } catch (error) {
        console.log(error);
    }
}

const loadDashboard = async(req, res) => {
    try {
        const userData = await User.findById({_id: req.session.user_id});
        res.render('home',{admin: userData});
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async(req, res) => {
    try {
        
        req.session.destroy();
        res.redirect('/admin');

    } catch (error) {
        console.log(error.message);
    }
}

const adminDashboard = async(req, res) => {
    try {

        let search = '';

        if (req.query.search){
            search = req.query.search;
        }

        const usersData = await User.find({
            is_admin: 0,
            $or : [
                { name : { $regex:'.*' + search + '.*', $options: 'i' } },
                { email : { $regex:'.*' + search + '.*', $options: 'i' } },
                { number : { $regex:'.*' + search + '.*', $options: 'i' } }
            ]
        });
        res.render('dashboard',{users: usersData});
        
    } catch (error) {
        console.log(error);
    }
};

// New User

const newUserLoad = async(req, res) => {
    try {
        
        res.render('new-user')

    } catch (error) {
        console.log(error.message);
    }
};

const addUser = async(req, res) => {
    try {

        if (req.body.name == '') {
            res.render('new-user', {message: 'Enter Name of the User'})
        } else if (req.body.email == '') {
            res.render('new-user', {message: 'Enter Email of the User'})
        } else if (req.body.number == '') {
            res.render('new-user', {message: 'Enter Mobile Number of the User'})
        } else if (req.body.password == '') {
            res.render('new-user', {message: 'Enter Role of the User'})
        } else if (req.body.newAdmin == '') {
            res.render('new-user', {message: 'Enter Name of the User'})
        } else if (req.body.name.length < 4) {
            res.render('new-user', {message: 'Minimum length of Name : 5'})
        } else if (req.body.name.length >= 25) {
            res.render('new-user', {message: 'Maximum length of Name : 25'})
        } else if (req.body.name[1] == ' ') {
            res.render('new-user', {message: 'Invalid Name Syntax'})
        } else if (req.body.number.length !== 10) {
            res.render('new-user', {message: 'Invalid Mobile Number'})
        } else if (req.body.password[1] == ' ') {
            res.render('new-user', {message: 'Invalid Password Syntax'})
        } else if (req.body.password.length < 4) {
            res.render('new-user', {message: 'Minimum length of Password : 5'})
        } else if (req.body.password.length >= 12) {
            res.render('new-user', {message: 'Maximum length of Password : 12'})
        } else {

            const name = req.body.name;
            const email = req.body.email;
            const number = req.body.number;
            const password = req.body.password;
            const newAdmin = req.body.newAdmin;

            const sPassword = await securePassword(password);

            const user = new User ({
                name: name,
                email: email,
                number: number,
                password: sPassword,
                is_admin: newAdmin,
            });

            // const  userData= await  User.findById({_id:userId},{$set:{
            //     name:req.body.name,
            //     email: req.body.email,
            //     number: req.body.number,
            //     image: req.file.filename,
            //     password:sPassword
                
            // }})

            const userData = await user.save();

            if (userData) {
                res.redirect('/admin/dashboard');
            } else {
                res.render('new-user', {message: 'User Not Added'})
            }

        }

        
        
    } catch (error) {
        console.log(error.message);
    };
};

// Edit User

const editUserLoad = async(req, res) => {
    try {

        const id = req.query.id;

        const userData = await User.findById({_id: id});
        if (userData) {
            res.render('edit-user', {user: userData});
        } else {
            res.redirect('/admin/dashboard');  
        };
        
    } catch (error) {
        console.log(error.message);
    }
};

const updateUser = async(req, res) => {
    try {

        const id = req.query.id;

        const userData = await User.findById({_id: id});

        if (req.body.name == '') {
            res.render('edit-user', {message: 'Enter Name of the User', user: userData})
        } else if (req.body.email == '') {
            res.render('edit-user', {message: 'Enter Email of the User', user: userData})
        } else if (req.body.number == '') {
            res.render('edit-user', {message: 'Enter Mobile Number of the User', user: userData})
        } else if (req.body.password == '') {
            res.render('edit-user', {message: 'Enter Role of the User', user: userData})
        } else if (req.body.name.length < 4) {
            res.render('edit-user', {message: 'Minimum length of Name : 5', user: userData})
        } else if (req.body.name.length >= 25) {
            res.render('edit-user', {message: 'Maximum length of Name : 25', user: userData})
        } else if (req.body.name[1] == ' ') {
            res.render('edit-user', {message: 'Invalid Name Syntax', user: userData})
        } else if (req.body.number.length !== 10) {
            res.render('edit-user', {message: 'Invalid Mobile Number', user: userData})
        } else {

        const userData = await User.findByIdAndUpdate({_id: req.body.id}, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                number: req.body.number,
                is_verified: req.body.verify
            }
        });

        res.redirect('/admin/dashboard');

    }
        
    } catch (error) {
        console.log(error.message);
    }
};

const deleteUser = async(req, res) => {
    try {

        const id = req.query.id;

        await User.deleteOne({_id: id});

        res.redirect('/admin/dashboard');
        
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUser,
    deleteUser
};