const passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const jwt = require('jsonwebtoken');
const User = require('../Model/user')
require('dotenv').config();


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;



passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },


  async function authenticate(request, accessToken, refreshToken, profile, done) {
    // console.log("hello")
    try {
        let user = await User.findOne({ google_id: profile.id });

        

        // console.log(profile)
        if (!user) {
            user = new User({
                google_id: profile.id, 
                User_Name: profile.displayName,
                Email: profile.emails[0].value,
                Display_Picture: profile.picture
            });
            await user.save();
        }
        const token = jwt.sign(
            { userId: user._id,
                 email: user.Email }, 
            "process.env.JWT_SECRET_KEY", 
            { expiresIn: '8h' }
          );
         
          request.res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: false,
          });
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}
)
);

module.exports = passport;
