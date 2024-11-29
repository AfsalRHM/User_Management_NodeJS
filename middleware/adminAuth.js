// const isLogin = async(req, res, next) => {
//     try {
        
//         if (req.session.user_id) {

//         } else {
//             res.redirect('/admin');
//         };
//         next();

//     } catch (error) {
//         console.log(error.message);
//     }
// };

// const isLogout = async(req, res, next) => {
//     try {

//         if (req.session.user_id) {
//             res.redirect('/admin/home')
//         }
//         next();

//     } catch (error) {
//         console.log(error.message);
//     }
// };

const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            next(); 
        } else {
            res.redirect('/admin'); 
        }
    } catch (error) {
        console.log(error.message);
    }
};

const isLogout = async (req, res, next) => {
    try {
        if (!req.session.user_id) {
            next();
        } else {
            res.redirect('/admin/home');
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    isLogin,
    isLogout
};