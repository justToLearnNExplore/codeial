const User = require('../models/user');

module.exports.profile = async function(req, res){
    try{
        const user = await User.findById(req.params.id)
        res.render('user_profile',{
        title:"UserProfile",
        profile_user: user
    });
    }catch(error){
        console.error('Error in getting information:', error);
        return res.status(500).send('Internal Server Error');
    }
    
}

module.exports.update = async function(req, res){
    try{
        if(req.user.id == req.params.id){
            const user = await User.findByIdAndUpdate(req.params.id, req.body);
            return res.redirect('back'); 
        }else{
            return res.status(481).send('Unauthorized');    
        }
    }catch(error){
        console.error('Error in getting information:', error);
        return res.status(500).send('Internal Server Error');
    }
    
}

module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/sign-in');
    }
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up",
    });
}

module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/sign-in');
    }
    return res.render('user_sign_in',{
        title:"Codeial | Sign In",
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
// module.exports.create = function(req, res){
//     if(req.body.password != req.body.confirm_password){
//         return res.redirect('back');
//     }
//     User.findOne({email: req.body.email}, function(err, user){
//         if(err){
//             console.log('error in signing up the user');
//             return;
//         }
//         if(!user){
//             User.create(req.body, function(err, user){
//                 if(err){
//                     console.log('error in signing up the user');
//                     return; 
//                 }
//                 return res.redirect('/users/sign-in');
//             })
//         }else{
//             return res.redirect('back');
//         }
//     });
    
// }


//signin & create a session for user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.flash('success', 'You have Logged out');
    req.logout(function(err) {
        if (err) {
            console.log('Error in logging out:', err);
            return res.redirect('/'); // Redirect to a particular page on error
        }
        return res.redirect('/users/sign-in'); // Redirect to a login page or another appropriate page on successful logout
    });
    
}
