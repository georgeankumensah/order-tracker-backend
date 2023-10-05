const express = require("express");
const userRouter = express.Router();
const user = require("../../middlewares/user.middleware");
const { isSuperAdmin } = require("../../middlewares/admin.middleware");

const { login, getUser, deleteAnAdmin, getAllAdmins, register, updateAnAdmin } = require("./user.controller");

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/", user, getUser);
userRouter.put("/admin/:id", isSuperAdmin, updateAnAdmin);
userRouter.delete("/admin/:id", isSuperAdmin, deleteAnAdmin);
userRouter.get("/admins", isSuperAdmin, getAllAdmins);

module.exports = userRouter;
