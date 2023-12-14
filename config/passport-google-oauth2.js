const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: "428721811778-jem9d6g0h94qoo51rkai7djt6184prij.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
},

async function(accessToken, refreshToken, profile, done) {
    try {
        let user = await User.findOne({ email: profile.emails[0].value }).exec();
      
        console.log(accessToken, refreshToken);
        console.log(profile);

        if (user) {
            return done(null, user);
        } else {
            // Generate a random password for the new user
            const randomPassword = crypto.randomBytes(20).toString('hex');

            // Create a new user based on Google profile using async/await
            const newUser = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: randomPassword
            });
            
            return done(null, newUser);
        }
    } catch (error) {
        console.log('Error in Google strategy passport:', error);
        return done(error);
    }
}
));



module.exports = passport;