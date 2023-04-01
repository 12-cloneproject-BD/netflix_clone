const express = require("express");
const router = express.Router();

const userRouter = require("./user.routes");

const videoRouter = require("./movie.route");
const likeRouter = require("./like.route");
const profileRouter = require("./profile.route");
const saveRouter = require("./save.route");
const adminRouter = require('./admin.route');

router.use("/user", userRouter);
router.use("/movies", videoRouter, likeRouter, saveRouter);
router.use('/admin', adminRouter);
router.use("/profile", profileRouter);

module.exports = router;
