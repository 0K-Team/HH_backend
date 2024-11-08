import Joi from "joi";

export const UserIdValidator = Joi
    .string()
    .length(15)
    .required()
    .pattern(/^[0-9]{15}$/);

export const ObjectIdValidator = Joi
    .string()
    .hex()
    .length(24);

export const ObjectIdValidatorParams = Joi.object({
    id: ObjectIdValidator
}).options({ stripUnknown: true });

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
        .pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
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
                .max(32),
            familyName: Joi
                .string()
                .max(32)
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
        .items(Joi.string().length(15).pattern(/^[0-9]{15}$/)),
    bio: Joi
        .string()
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
        .string()
        .min(2)
        .max(100),
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

export const ProductValidator = Joi.object({
    name: Joi
        .string()
        .max(128)
        .required(),
    category: Joi
        .string()
        .max(128)
        .required(),
    brand: Joi
        .string()
        .max(128)
        .required(),
    price: Joi.number(),
    currency: Joi
        .string()
        .length(3),
    productUrl: Joi
        .string(),
    description: Joi
        .string()
        .max(400)
        .required(),
    carbonFootprint: Joi.object({
        co2Emission: Joi.string(),
        unit: Joi.string()
    }),
    durability: Joi.string(),
    recyclingInfo: Joi
        .string()
        .max(400),
    imageUrl: Joi.string(),
    ecoCertification: Joi.string(),
    ecoFriendly: Joi.boolean()
});

export const DiscountValidator = Joi.object({
    discountCode: Joi.string().allow(""),
    description: Joi.string().allow(""),
    validUntil: Joi.date(),
    partnerBrand: Joi.string().allow(""),
    productRestrictions: Joi.string().allow(""),
    termsAndConditions: Joi.string().allow(""),
    url: Joi.string().allow("")
})

export const QuizValidator = Joi.object({
    _id: ObjectIdValidator,
    answers: Joi.array().items(Joi.object().keys({
        id: Joi.string().max(2).pattern(/^[0-9]{1,2}$/),
        answer: Joi.string().length(1).pattern(/^[A-D]$/).required(),
    }))
})

export const CalculatorValidator = Joi.object({
    transport: Joi.object({
        car_usage: Joi.number().min(0).max(3),
        fuel_type: Joi.number().min(0).max(4),
        weekly_km: Joi.number().min(0).max(3),
        flight_frequency: Joi.number().min(0).max(3),
        public_transport_usage: Joi.number().min(0).max(3)
    }),
    energy: Joi.object({
        energy_source: Joi.number().min(0).max(3),
        water_heating_source: Joi.number().min(0).max(3),
        monthly_kWh: Joi.number().min(0).max(3),
        energy_efficiency: Joi.number().min(0).max(2)
    }),
    water: Joi.object({
        shower_time: Joi.number().min(0).max(3),
        bathtub_usage: Joi.number().min(0).max(3)
    }),
    waste: Joi.object({
        waste_segregation: Joi.number().min(0).max(2),
        food_waste: Joi.number().min(0).max(3),
        plastic_usage: Joi.number().min(0).max(3)
    }),
    food: Joi.object({
        meat_consumption: Joi.number().min(0).max(4),
        local_food_preference: Joi.number().min(0).max(3)
    }),
    leisure: Joi.object({
        movie_watch_time: Joi.number().min(0).max(3),
        shopping_frequency: Joi.number().min(0).max(3)
    })
}).options({ stripUnknown: true });