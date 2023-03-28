const express = require("express");
const router = express.Router();

const { upload } = require('../middlewares/multer');
const AdminController = require("../controllers/admin.controller");
const adminController = new AdminController();

router.post("/", upload.array('files', 2), adminController.postMovie);
router.put("/:movieId", upload.array('files', 2), adminController.updateMovie);
router.delete("/:movieId", adminController.deleteMovie);

module.exports = router;
