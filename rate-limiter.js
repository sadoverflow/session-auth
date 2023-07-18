import rateLimiter from "express-rate-limit";

export const loginLimiter = rateLimiter({
    max: 5,
    windowMS: 1000 * 60 * 30,
    message: {
        error: "Too Many Requests",
        status: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});
