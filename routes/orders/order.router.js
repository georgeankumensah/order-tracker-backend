const express = require("express");
const user = require("../../middlewares/user.middleware");
const { isAdmin } = require("../../middlewares/admin.middleware");

const { getAllOrders, getAnOrder, updateAnOrder, deleteAnOrder, getOrderByShareable, deleteAllOrders, postAnOrder } = require("./order.controller");

const orderRouter = express.Router();
orderRouter.get("/", isAdmin, getAllOrders);
orderRouter.post("/", isAdmin, postAnOrder);
orderRouter.get("/:id", isAdmin, getAnOrder);
orderRouter.get("/shareable/:shareableID", getOrderByShareable);
orderRouter.put("/:id", isAdmin, updateAnOrder);
orderRouter.delete("/:id", isAdmin, deleteAnOrder);
orderRouter.delete("/all", isAdmin, deleteAllOrders);

module.exports = orderRouter;
