const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewareProfile");

const MovieController = require("../controllers/movie.controller");
const movieController = new MovieController();

//전체영상 조회
router.get("/", authMiddleware, movieController.allMovies);
// router.get("/", authMiddleware, movieController.allMovies);

//영상 카테고리 전달
router.get("/category", authMiddleware, movieController.moviesCategory);

//카테고리별 조회
router.get(
  "/category/:genre",
  authMiddleware,
  movieController.videosByCategory
);
// router.get("/:categoryIdx", authMiddleware, movieController.moviesByCategory);

//영상 상세조회
router.get("/detail/:contentIdx", authMiddleware, movieController.onesMovie);
// router.get("/:contentIdx", authMiddleware, movieController.onesMovie);

//찜목록 조회
router.get("/save", authMiddleware, movieController.savedVideo);

// //viewRank순 조회
router.get("/rank/view", authMiddleware, movieController.viewRank);

// //likeRank순 조회
router.get("/rank/like", authMiddleware, movieController.likeRank);

// //viewHistory가 있을때 조회
router.get("/viewHistory", authMiddleware, movieController.viewHistory);

// 영상 재생
router.get("/view/:contentIdx", authMiddleware, movieController.viewContent);

// 영상 좋아요
router.put("/like/:contentIdx", authMiddleware, movieController.pickThisContent);

module.exports = router;
