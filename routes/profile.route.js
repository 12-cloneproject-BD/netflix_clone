const express = require("express");
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const ProfileController = require("../controllers/profile.controller");
const profileController = new ProfileController();

//프로필 생성
router.post("/", authMiddleware, profileController.createProfile);
//프로필 전체 조회
router.get("/", authMiddleware,profileController.getAllProfile);
//프로필 조회
router.get("/:profileIdx", authMiddleware,profileController.getProfile);
//프로필 로그인 (프로필 선택)
router.get("/:profileIdx/login", authMiddleware,profileController.profileLogin);
//프로필 수정
router.put("/:profileIdx", authMiddleware,profileController.updateProfile);
//프로필 삭제
router.delete("/:profileIdx", authMiddleware, profileController.deleteProfile)

module.exports = router;
