export interface Quiz {
    topic: string;
    description?: string;
    questions?: Omit<QuizQuestion, "correct_answer">[];
    difficulty_level?: string;
    category?: string;
    time_limit?: number;
    points_reward?: number;
}

export type Omit<T, O extends keyof T> = Pick<T, Exclude<keyof T, O>>

export interface QuizQuestion {
    question: string;
    answers: {
        A: string;
        B: string;
        C: string;
        D: string
    };
    correct_answer: string;
}