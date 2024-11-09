export interface User {
    id: string;
    email?: string;
    username: string;

    fullName: {
        givenName?: string;
        familyName?: string;
    };
    avatarHash?: string;

    provider: string;
    googleID?: string;
    facebookID?: string;

    title?: string;
    friends?: string[];
    bio?: string;
    achievements?: Achievement[];
    skills?: string[];

    location?: string;
    country?: string;

    preferredTopics?: string[];
    points?: number;

    createdAt?: string;

    admin?: boolean;
    configured?: boolean;
    mailSent?: boolean;
}

export interface Achievement {
    name: string;
    dateAwarded: Date;
    description?: string;
    icon?: string;
    id: string;
}