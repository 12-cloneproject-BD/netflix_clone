const express = require("express");
const router = express.Router();

const MovieController = require("../controllers/movie.controller");
const movieController = new MovieController();

//전체영상 조회
router.get("/movies", movieController.allMovies);
//카테고리별 조회
// router.get("/movies/:categoryId", movieController.moviesByCategory);
//영상 상세조회
router.get("movies/:categoryId/:movieId", movieController.onesMovie);

module.exports = router;
