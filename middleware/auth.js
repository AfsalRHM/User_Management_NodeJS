// const isLogin = async(req, res, next) => {
//     try {

//         if (req.session.user_id) {

//         }else {
//             res.redirect('/');
//         };
//         next();
        
//     } catch (error) {
//         console.log(error.message)
//     };
// };

// const isLogout = async(req, res, next) => {
//     try {

//         if (req.session.user_id) {
//             res.redirect("/home");
//         }
//         next();

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// module.exports = {
//     isLogin,
//     isLogout
// };

const isLogin = (req, res, next) => {
    try {
        if (req.session.user_id) {
            next(); 
        } else {
            res.redirect('/'); 
        }
    } catch (error) {
        console.log(error.message);
    }
};

const isLogout = (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect("/home"); 
        } else {
            next(); 
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error'); 
    }
}

module.exports = {
    isLogin,
    isLogout
};
