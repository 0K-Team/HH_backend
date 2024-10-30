import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import AccountData from "../schemas/accounts";

passport.serializeUser((user, done) => {
    // @ts-ignore
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await AccountData.findById(id);
        return done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "/v1/user/auth/google/callback",
    scope: ["email", "profile"]
}, async (_accessToken, _refreshToken, profile, done) => {
    const { id, username, emails, name } = profile;
    if (!emails) return done("No email found", false);
    const email = emails[0].value;
    const user = await AccountData.findOneAndUpdate({
        email
    }, {
        $setOnInsert: {
            username,
            provider: "google",
        },
        fullName: name,
        googleID: id
    }, {
        upsert: true,
        new: true
    });

    return done(null, user);
}));