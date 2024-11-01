import { NextFunction, Request, Response } from "express"

export const admin = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).send("Unauthorized"), undefined;
        // @ts-ignore
        if (!req.user.admin) return res.status(403).send("You do not have admin permissions"), undefined;
        next();
    }
}