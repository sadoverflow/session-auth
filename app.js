import express from "express";
import morgan from "morgan";
import RedisStore from "connect-redis";
import session from "express-session";
import { sessionOptions } from "./config/session.js";
import { createClient } from "redis";
import authRouter from "./api/routes/authRouter.js";
import { isAuth } from "./api/middlewares/auth.js";

const app = express();

const redisClient = createClient();
const redisStore = new RedisStore({
    client: redisClient,
    disableTouch: true,
});

redisClient
    .connect()
    .then(() => {
        console.log("Connected to redis successfully");
    })
    .catch((err) => console.log(err));

app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        store: redisStore,
        ...sessionOptions,
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

export default app;
