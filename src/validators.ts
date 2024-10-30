import Joi from "joi";

export const PostValidator = Joi.object({
    author: Joi
        .string()
        .length(15)
        .required()
        .pattern(new RegExp('^[0-9]{15}$')),
    content: Joi
        .string()
        .min(1)
        .max(300)
        .required(),
    date: Joi
        .date()
        .iso()
        .default(() => new Date().toISOString()),
    likes: Joi
        .array()
        .optional()
        .default([]),
    tags: Joi
        .array()
        .optional()
        .default([]),
    images: Joi
        .array()
        .optional()
        .default([])
});