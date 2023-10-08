const express = require("express");
const morgan = require("morgan");
const session = require("express-session");

const error = require("./middlewares/error.middleware");

const appRouter = require("./routes");

const app = express();
app.use(express.json());

let initialObj = {
	secret: "thisisascretkeythatwillbechangedsoon",
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		sameSite: "strict",
		secure: process.env?.NODE_ENV === "production",
	},
};

app.use(morgan("combined"));
app.use(session(initialObj));
app.use("/", appRouter);

app.use(error);

module.exports = app;
