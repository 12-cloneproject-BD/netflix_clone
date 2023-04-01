const express = require("express");
const router = express.Router();

const userRouter = require("./user.routes");
const profileRouter = require("./profile.route");
const videoRouter = require("./movie.route");
const likeRouter = require("./like.route");
const saveRouter = require("./save.route");
const adminRouter = require('./admin.route');
const adminRouter = require('./admin.route');

router.use("/user", userRouter);
router.use("/profile", profileRouter);
router.use("/movies", videoRouter, likeRouter, saveRouter);
router.use('/admin', adminRouter);
router.use("/profile", profileRouter);

module.exports = router;
