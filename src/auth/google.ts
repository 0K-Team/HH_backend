import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as CustomStrategy } from "passport-custom";
import { OAuth2Client } from "google-auth-library";
import AccountData from "../schemas/accounts";
import md5 from "md5";
import { uploadAvatar } from "../assets/upload";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

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
    callbackURL: "/api/v1/auth/google/callback",
    scope: ["email", "profile"]
}, async (_accessToken, _refreshToken, profile, done) => {
    const { id, displayName, emails, name } = profile;
    if (!emails) return done("No email found", false);
    const email = emails[0].value;
    const user = await AccountData.findOneAndUpdate({
        email
    }, {
        $setOnInsert: {
            username: displayName,
            provider: "google",
            fullName: name,
            googleID: id
        }
    }, {
        upsert: true,
        new: true
    });

    if (!user.avatarHash && profile._json.picture) {
        const hash = md5(user.id + Date.now());
        try {
            const image = await fetch(profile._json.picture as string);
            const buffer = Buffer.from(await image.arrayBuffer());
            uploadAvatar(buffer, user.id, hash);
            return done(null, await AccountData.findOneAndUpdate({
                email
            }, {
                avatarHash: hash
            }) ?? false);
        } catch (error) {
            console.error(error);
        }
    }

    return done(null, user);
}));

passport.use("googleToken", new CustomStrategy(
    async (req, done) => {
        const { idToken } = req.body;

        if (!idToken) return done("No ID Token", false);

        try {
            const ticket = await client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();

            if (!payload) return done("Invalid token", false);

            const email = payload.email;
            if (!email) return done("No email found", false);

            const user = await AccountData.findOneAndUpdate({
                email
            }, {
                $setOnInsert: {
                    username: payload.name,
                    provider: "google",
                    fullName: {
                        givenName: payload.given_name,
                        familyName: payload.family_name
                    },
                    googleID: payload.sub
                }
            }, {
                upsert: true,
                new: true
            });

            if (!user.avatarHash && payload.picture) {
                const hash = md5(user.id + Date.now());
                try {
                    const image = await fetch(payload.picture as string);
                    const buffer = Buffer.from(await image.arrayBuffer());
                    uploadAvatar(buffer, user.id, hash);
                    return done(null, await AccountData.findOneAndUpdate({
                        email
                    }, {
                        avatarHash: hash
                    }) ?? false);
                } catch (error) {
                    console.error(error);
                }
            }

            done(null, user);

        } catch (error) {
            console.error(error);
            return done("Invalid token", false);
        }
    }
))