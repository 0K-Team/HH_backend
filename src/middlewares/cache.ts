import { Request, Response, NextFunction } from "express";
import { CacheHandler } from "../handlers/CacheHandler";

export const cache = (handler: CacheHandler<any>, from: string = "id", staticValue?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = staticValue ?? req.params[from];
        if (handler.has(key)) return res.send(handler.get(key)), undefined;
        else {
            const send = res.send;

            res.send = function(body?: any) {
                if (typeof body == "object") return send.call(this, body);
                const json = JSON.parse(body);
                handler.cache(key, json);

                return send.call(this, body);
            };

            next();
        }
    }
}