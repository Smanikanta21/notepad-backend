const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL

},
async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const profilepic = profile.photos[0].value;

    try{
        let user = await User.findOne({email});
        if (!user){
            user = await User.create({
                name,email,password:'',profilepic,provider:'google'
            })
        }
        return done(null, user);
    } catch (error) {
        console.error(error);
        return done(error);
    }
}
))

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    // Here you would typically find the user in your database
    // For now, we will just return the user
    done(null, user);
})