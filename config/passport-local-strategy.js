const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// passport.use(new LocalStrategy({
//     usernameField: 'email'
// },
// function(email, password, done){
//     //find user & establish identity
//     User.findOne({email: email}, function(err, user){
//          if(err){
//             console.log('Error in finding user --> Passport');
//             return done(err);
//          }

//          if(!user || user.password != password){
//             console.log('Invalid Username/Password');
//             return done(null, false);
//          }
//          return done(null, user);
//     });
// }
// ));

//serializing the user to decide which key is to be kept in the cookies

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
async function(req, email, password, done){
    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            req.flash('error', 'Invalid Username/Password');
            //console.log('Invalid Username/Password');
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        req.flash('error', err);
        //console.log('Error in finding user --> Passport', err);
        return done(err);
    }
}
));


passport.serializeUser(function(user, done){
     done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(async function(id, done){
    try {
        const user = await User.findById(id);

        if (!user) {
            console.log('User not found');
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log('Error in finding user --> Passport', err);
        return done(err);
    }
});


// passport.deserializeUser(function(id, done){
//       User.findById(id, function(err, user){
//           if(err){
//             console.log('Error in finding user --> Passport');
//             return done(err);
//           }
//           return done(null, user);
//       });
// });


passport.checkAuthentication = function(req, res, next){
    //if the user is signed in
    if(req.isAuthenticated()){
        return next();
    }

    //if user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains current signed in user from session cookies & we are sending this to locals for views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;