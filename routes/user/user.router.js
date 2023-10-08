const express = require("express");
const userRouter = express.Router();
const user = require("../../middlewares/user.middleware");
const { isSuperAdmin } = require("../../middlewares/admin.middleware");

const { login,logout, getUser, deleteAnAdmin, getAllAdmins, register, updateAnAdmin } = require("./user.controller");

userRouter.post("/register",isSuperAdmin, register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/", user, getUser);
userRouter.put("/admin/:id",isSuperAdmin,  updateAnAdmin);
userRouter.delete("/admin/:id", isSuperAdmin, deleteAnAdmin);
userRouter.get("/admins",  getAllAdmins);

module.exports = userRouter;
