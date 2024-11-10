/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { CacheHandler } from "../handlers/CacheHandler";

export const cache = (handler: CacheHandler<any>, from: (string | ((req: Request) => string)) = "id", staticValue?: string, force: boolean = false) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = staticValue ?? typeof from == "function" ? (from as ((req: Request) => string))(req) : req.params[from];
        if (handler.has(key) && !force) return res.send(handler.get(key)), undefined;
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

export const cacheRemove = (handler: CacheHandler<any>, from: (string | ((req: Request) => string)) = "id", staticValue?: string) => {
    return (req: Request, _: Response, next: NextFunction) => {
        const key = staticValue ?? typeof from == "function" ? (from as ((req: Request) => string))(req) : req.params[from];
        
        if (key) handler.drop(key);

        next();
    }
}

export const cacheDestroy = (handler: CacheHandler<any>, expectedStatus: number = 200) => {
    return (_: Request, res: Response, next: NextFunction) => {
        const status = res.status;

        res.status = function(code: number) {
            if (expectedStatus == code) handler.drop();
            return status(code);
        };

        next();
    }
}