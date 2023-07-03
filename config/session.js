import dotenv from "dotenv";

dotenv.config();

const { SESSION_SECRET } = process.env;

export const sessionOptions = {
    name: "qid",
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
        secure: false,
    },
};
