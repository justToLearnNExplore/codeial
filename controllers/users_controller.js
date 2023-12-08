const User = require('../models/user');

module.exports.profile = async function (req, res) {
    if(req.cookies.user_id){
        try {
            const user = await User.findById(req.cookies.user_id);
          
            if (user) {
              // User found, handle the logic
              res.render('user_profile',{
              title: 'User Profile',
              user: user
            })
            } else {
                return res.redirect('/users/sign-in');
            }
          } catch (err) {
            console.error('Error in finding user:', err);
            // Handle the error
            res.status(500).send('Internal Server Error');
          }
          
    }else{
        return res.redirect('/users/sign-in');
    }
}

module.exports.logout = function(req, res){
    res.clearCookie('user_id');
    return res.redirect('/users/sign-in');
}

module.exports.signUp = function (req, res) {
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up",
    });
}

module.exports.signIn = function (req, res) {
    return res.render('user_sign_in', {
        title: "Codeial | Sign In",
    });
}

//get signup data
module.exports.create = async function (req, res) {
    if (req.body.password !== req.body.confirm_password) {
        // Sending a response to the client with an alert
        return res.status(400).send('<script>alert("Passwords do not match"); window.history.back();</script>');
     }
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.redirect('back');
        }

        const newUser = await User.create(req.body);
        return res.redirect('/users/sign-in');
    } catch (error) {
        console.error('Error in signing up the user:', error);
        return res.status(500).send('Internal Server Error');
    }
};


// module.exports.create = function (req, res) {
//     if (req.body.password != req.body.confirm_password) {
//         return res.redirect('back');
//     }
//     User.findOne({ email: req.body.email }, function (err, user) {
//         if (err) {
//             console.log('error in signing up the user');
//             return;
//         }
//         if (!user) {
//             User.create(req.body, function (err, user) {
//                 if (err) {
//                     console.log('error in signing up the user');
//                     return;
//                 }
//                 return res.redirect('/users/sign-in');
//             })
//         } else {
//             return res.redirect('back');
//         }
//     });

// }


// const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// module.exports.create = async function (req, res) {
//     const { email, password, confirm_password } = req.body;

//     // Check if passwords match
//     if (password !== confirm_password) {
//         return res.status(400).send('Passwords do not match');
//     }

//     try {
//         // Check if user already exists
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return res.status(400).send('User already exists');
//         }

//         // Hash the password before saving to the database
//         const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

//         // Create a new user
//         const newUser = await User.create({ email, password: hashedPassword });

//         // Redirect to sign-in page after successful signup
//         return res.redirect('/users/sign-in');
//     } catch (err) {
//         console.log('Error in signing up the user:', err);
//         return res.status(500).send('Internal Server Error');
//     }
// };


//signin & create a session for user
module.exports.createSession = async function (req, res, user) {
    try {
        // Find user by email
        const foundUser = await User.findOne({ email: req.body.email });

        if (foundUser) {
            // Check if passwords match
            const isPasswordMatch = foundUser.password === req.body.password;

            if (!isPasswordMatch) {
                return res.redirect('back'); // Passwords don't match
            }

            // Handle successful login: set cookies, create session, and redirect
            res.cookie('user_id', foundUser._id);
            return res.redirect('/users/profile');
        } else {
            // User not found
            return res.redirect('back');
        }
    } catch (err) {
        console.error('Error in signing in the user:', err);
        return res.status(500).send('Internal Server Error');
    }
};


// module.exports.createSession = async function (req, res, user) {
    //find user
    // User.findOne({email: req.body.email}, function(err, user){
    //     if(err){
    //         console.log('error in signing in the user');
    //         return;
    //     }
    //        //handle user found
    //     if(user){
    //        //handle password which doesnt match
    //        if(user.password != req.body.password){
    //         return res.redirect('back');
    //        }
    //        //handle session creation
    //        res.cookie('user_id', user_id);
    //        return res.redirect('/users/profile');

    //     }else{
    //        //handle user not found
    //        return res.redirect('back');
    //     }
    // });

// }