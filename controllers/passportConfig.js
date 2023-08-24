const GoogleStrategy = require("passport-google-oauth2").Strategy;
const userModel = require("../models/user");

const passportConfig = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          let existingUser = await userModel.findOne({
            googleId: profile.id,
          });
          if (existingUser) return done(null, existingUser);

          console.log("Creating new user...");
          const newUser = new userModel({
            method: "google",
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile._json.picture,
            isVerified: true,
          });
          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

module.exports = passportConfig;
