import Joi from "joi";

export const UserIdValidator = Joi
    .string()
    .length(15)
    .required()
    .pattern(/^[0-9]{15}$/)

export const PostValidator = Joi.object({
    _id: Joi
        .object(),
    author: UserIdValidator,
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
        .items(Joi.string().length(15).pattern(/^[0-9]{15}$/)),
    tags: Joi
        .array()
        .items(Joi.string().min(1).max(64)),
    images: Joi
        .array()
        .items(Joi.string())
}).options({ stripUnknown: true });

export const UserValidator = Joi.object({
    _id: Joi
        .object(),
    id: UserIdValidator,
    email: Joi
        .string()
        .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    username: Joi
        .string()
        .required()
        .min(2)
        .max(32),
    fullName: Joi
        .object().keys({
            _id: Joi
                .object(),
            givenName: Joi
                .string()
                .min(1)
                .max(50),
            familyName: Joi
                .string()
                .min(1)
                .max(50)
        }),
    avatarHash: Joi
        .string(),
    provider: Joi
        .string()
        .valid("google", "facebook"),
    googleID: Joi
        .string(),
    facebookID: Joi
        .string(),
    title: Joi
        .string(),
    notifications: Joi
        .array()
        .items(Joi.object().keys({
            _id: Joi
                .object(),
            title: Joi.string().min(1).max(128),
            date: Joi.string().isoDate()
        })),
    friends: Joi
        .array()
        .items(UserIdValidator),
    bio: Joi
        .string()
        .min(1)
        .max(230),
    achievements: Joi
        .array()
        .items(Joi.object().keys({
            _id: Joi
                .object(),
            name: Joi.string().min(1).max(128),
            date_awarded: Joi.string().isoDate()
        })),
    skills: Joi
        .array()
        .items(Joi.string()),
    badges: Joi
        .array()
        .items(Joi.string()),
    location: Joi
        .string(),
    preferredTopics: Joi
        .array()
        .items(Joi.string().min(1).max(64)),
    points: Joi
        .number()
}).options({ stripUnknown: true });

export const BlogValidator = Joi.object({
    image: Joi
        .string(),
    title: Joi
        .string()
        .min(1)
        .max(64)
        .required(),
    author: UserIdValidator,
    content: Joi
        .string()
        .min(1)
        .max(1000)
        .required()
}).options({ stripUnknown: true });