import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import authRouter from "./api/routes/authRouter.js";
import isAuth from "./api/middlewares/isAuth.js";
import connectDB from "./db/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

const redisClient = createClient();
const redisStore = new RedisStore({
    client: redisClient,
    disableTouch: true,
});

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        store: redisStore,
        name: "qid",
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 3,
            httpOnly: true,
            secure: false,
        },
    })
);

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/dash", isAuth, (req, res) => {
    res.render("dash", {
        userEmail: req.session.user.email,
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.all("*", (req, res) => {
    res.status(404).json({ message: "RESOURSE NOT FOUND" });
});

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        await redisClient.connect();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();

export default app;
