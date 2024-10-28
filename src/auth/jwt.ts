import passport from "passport";
import AccountData from "../schemas/accounts";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { Request } from "express";

const fromCookie = (req: Request) => {
    return req?.cookies?.["jwt"];
}

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([fromCookie, ExtractJwt.fromAuthHeaderAsBearerToken()]),
    secretOrKey: process.env.JWT_SECRET as string
}, async (payload, done) => {
    try {
        const user = await AccountData.findById(payload.id);

        if (user) done(null, user);
        else done(null, false);
    } catch (err) {
        done(err, false);
    }
}))