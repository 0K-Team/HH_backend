import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
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

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID as string,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    callbackURL: "/api/v1/auth/facebook/callback",
    profileFields: [
        "id",
        "email",
        "displayName",
        "name",
        "picture.type(large)"
    ]
}, async (_accessToken, _refreshToken, profile, done) => {
    const { username, emails, id, name } = profile;
    const email = emails?.[0]?.value;
    const user = await AccountData.findOneAndUpdate({
        email
    }, {
        $setOnInsert: {
            username,
            provider: "facebook",
        },
        fullName: name,
        facebookID: id
    }, {
        upsert: true,
        new: true
    });

    return done(null, user);
}));
