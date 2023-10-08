const express = require("express");
const userRouter = require("./user/user.router");
const orderRouter = require("./orders/order.router");

const appRouter = express.Router();
appRouter.get("/", (req, res) => {
	res.json({ success: true });
});

appRouter.use("/user", userRouter);
appRouter.use("/order", orderRouter);

module.exports = appRouter;
