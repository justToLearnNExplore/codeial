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

module.exports.create = function(req, res){
    
}

module.exports.createSession = function(req, res){
    
}


