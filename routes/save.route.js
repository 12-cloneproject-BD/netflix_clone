const express = require("express");
const router = express.Router();
const { Content, Like } = require("../models");
const authMiddleware = require("../middlewares/authMiddlewareProfile");
const Boom = require("boom");
const { Op } = require("sequelize");

router.put("/save/:contentIdx", authMiddleware, async (req, res, next) => {
  try {
    const { contentIdx } = req.params;
    const { profileIdx } = res.locals.profile;

    const findContent = await Content.findByPk(contentIdx);
    if (!findContent) {
      throw Boom.notFound("컨텐츠가 존재하지 않습니다.", false);
    }
    const savedVideo = await Content.findOrCreate({
      where: {
        [Op.and]: [{ profileIdx }, { contentIdx }],
      },
      default: {
        contentIdx,
        profileIdx,
      },
    }).then(([data, created]) => {
      if (!created) {
        data.destroy();
        return "delete";
      }
      return "create";
    });

    if (savedVideo === "create") {
      return res.status(200).json({ message: "영상을 찜하였습니다." });
    } else if (savedVideo === "delete") {
      return res.status(200).json({ message: "찜하기를 취소하셨습니다." });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
