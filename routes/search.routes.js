const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const SearchController = require("../controllers/search.controller");
const searchController = new SearchController();

// 검색
router.get("/", searchController.searchContents);
// 연관 검색어
// router.post("/", authMiddleware, searchController.searchRelatedTerm)
module.exports = router;
