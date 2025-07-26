const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
function setupGooglePassport({ clientID, clientSecret, callbackURL }) {
    passport.use(new GoogleStrategy({
        clientID,
        clientSecret,
        callbackURL
    },
    async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const profilepic = profile.photos[0].value;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    name, email, password: '', profilepic, provider: 'google'
                });
            }
            return done(null, user);
        } catch (error) {
            console.error(error);
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

module.exports = setupGooglePassport;
