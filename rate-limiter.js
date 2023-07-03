import rateLimiter from "express-rate-limit";

export const limiter = rateLimiter({
    max: 5,
    windowMS: 1000 * 60 * 5,
    message: {
        error: "You can't make any more requests at the moment. Try again later",
        status: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const loginLimiter = rateLimiter({
    max: 5,
    windowMS: 1000 * 60 * 30,
    message: {
        error: "You can't make any more requests at the moment. Try again later",
        status: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});
