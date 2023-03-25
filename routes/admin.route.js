const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/admin.controller");
const adminController = new AdminController();

router.post("/", adminController.postMovie);
router.put("/:movieId", adminController.updateMovie);
router.delete("/:movieId", adminController.deleteMovie);

module.exports = router;
å;
