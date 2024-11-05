import { NextFunction, Request, Response } from "express"
import Joi from "joi";

export const validateBody = (validator: Joi.AnySchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validated = validator.options({ stripUnknown: true }).validate(req.body);
        if (validated.error) res.status(400).send(`Validation of request body failed: ${validated.error.message}`);
        next();
    }
}

export const validateParams = (validator: Joi.AnySchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validated = validator.options({ stripUnknown: true }).validate(req.params);
        if (validated.error) res.status(400).send(`Validation of request params failed: ${validated.error.message}`);
        next();
    }
}

export const validateQuery = (validator: Joi.AnySchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validated = validator.options({ stripUnknown: true }).validate(req.query);
        if (validated.error) res.status(400).send(`Validation of request params failed: ${validated.error.message}`);
        next();
    }
}
