const User = require('../models/user');

module.exports.profile = function(req, res){
    res.render('user_profile',{
        title:"UserProfile",
    });
}

module.exports.signUp = function(req, res){
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up",
    });
}

module.exports.signIn = function(req, res){
    return res.render('user_sign_in',{
        title:"Codeial | Sign In",
    });
}

//get signup data
module.exports.create = function(req, res){
    if(req.body.password != req.body.comfirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('error in signing up the user');
            return;
        }
        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    console.log('error in signing up the user');
                    return; 
                }
                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    });
    
}
//signin & create a session for user
module.exports.createSession = function(req, res){
    
}


