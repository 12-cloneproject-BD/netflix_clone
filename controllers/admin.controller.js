const AdminService = require("../services/admin.service");
const Boom = require("boom");
const Joi = require("joi");
const _ = require('lodash');
const multer = require("multer");
const schema = require("../schemas/adminMovie.schema");

class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  postMovie = async (req, res) => {
    try {
      const {
        name,
        desc,
        kind,
        viewLimit,
        playtime,
        status
      } = req.body;
      const files = req.files;
      const filenameImage = req.files.filenameImage;
      const filenameVideo = req.files.filenameVideo;

      const videothumbUrl = `http://localhost:3050/uploads/${filenameImage}`;
      const videoUrl = `http://localhost:3050/uploads/${filenameVideo}`;
      
      const validate = schema.validate(
        { name, kind, desc, playtime, viewLimit, status, videothumbUrl, videoUrl },
        { abortEarly: false }
      );

      if (validate.error) {
        throw Boom.badRequest(validate.error.message);
      } else {
        console.log("Validate input");
      }
      
      const postedMovie = await this.adminService.postMovie({
        name,
        kind,
        desc,
        playtime,
        viewLimit,
        status,
        videothumbUrl,
        videoUrl,
      });
      return res.status(201).json({postedMovie, message: "영상 등록을 완료했습니다." });
    } catch (error) {
      if (Boom.isBoom(error)) {
        res.status(error.statusCode).json({ errorMessage: error.message }); // 에러 메시지를 설정하면 이쪽으로 빠집니다.
      } else {
        res.status(400).json({ errorMessage: "영상 등록에 실패하였습니다." });
      }
    }
  };

  updateMovie = async (req, res) => {
    try {
      const { contentIdx } = req.params;
      const { name, kind, desc, playtime, viewLimit, status} = req.body;
      const filenameImage = req.files.filenameImage;
      const filenameVideo = req.files.filenameVideo;
      const videothumbUrl = `http://localhost:3050/uploads/${filenameImage}`;
      const videoUrl = `http://localhost:3050/uploads/${filenameVideo}`;

      const updateObj = _.pickBy({ name, kind, desc, playtime, viewLimit, status}, (value)=>{
        return value !== undefined;
      });

      updateObj.contentIdx = contentIdx;
      updateObj.videothumbUrl = videothumbUrl;
      updateObj.videoUrl = videoUrl;

      const updatedMovie = await this.adminService.updateMovie(updateObj);
      return res
        .status(201)
        .json({ updatedMovie, message: "정보 수정을 완료했습니다." });
    } catch (error) {
      if (Boom.isBoom(error)) {
        res.status(error.statusCode).json({ errorMessage: error.message }); // 에러 메시지를 설정하면 이쪽으로 빠집니다.
      } else {
        res.status(400).json({ errorMessage: "정보 수정에 실패하였습니다." });
      }
    }
  };

  deleteMovie = async (req, res) => {
    try {
      const { contentIdx } = req.params;

      await this.adminService.deleteMovie({ contentIdx });
      return res.status(201).json({ message: "영상을 삭제했습니다." });
    } catch (error) {
      if (Boom.isBoom(error)) {
        res.status(error.statusCode).json({ errorMessage: error.message }); // 에러 메시지를 설정하면 이쪽으로 빠집니다.
      } else {
        res.status(400).json({ errorMessage: "영상 삭제에 실패하였습니다." });
      }
    }
  };
}

module.exports = AdminController;
