const AdminService = require("../services/admin.service");
const Boom = require("boom");
const Joi = require("joi");

const messages = {
  "string.base": "이 필드는 문자열로 이루어져야 합니다.",
  "string.empty": "이 필드는 비어 있을 수 없습니다.",
  "string.min": "이 필드는 최소 {{#limit}} 문자 이상이어야 합니다.",
  "string.max": "이 필드는 최대 {{#limit}} 문자 이하여야 합니다.",
  "any.required": "이 필드는 필수입니다.",
};

class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  postMovie = async (req, res) => {
    try {
      const {
        title,
        category,
        desc,
        playtime,
        actor,
        genre,
        thumbUrl,
        movieUrl,
      } = req.body;

      const schema = Joi.object({
        title: Joi.string()
          .min(1)
          .max(30)
          .messages({
            ...messages,
            "string.min": "이 필드는 최소 {{#limit}} 문자 이상이어야 합니다.",
            "string.max": "이 필드는 최대 {{#limit}} 문자 이하여야 합니다.",
          }),
        category: Joi.string()
          .min(1)
          .max(30)
          .message({
            ...messages,
            "string.min": "이 필드는 최소 {{#limit}} 문자 이상이어야 합니다.",
            "string.max": "이 필드는 최대 {{#limit}} 문자 이하여야 합니다.",
          }),
        desc: Joi.string()
          .min(1)
          .max(300)
          .message({
            ...messages,
            "string.min": "이 필드는 최소 {{#limit}} 문자 이상이어야 합니다.",
            "string.max": "이 필드는 최대 {{#limit}} 문자 이하여야 합니다.",
          }),
        playtime: Joi.any().message({
          ...messages,
          "any.required": "이 필드는 필수입니다.",
        }),
        actor: Joi.string().message({
          ...messages,
          "any.required": "이 필드는 필수입니다.",
        }),
        genre: Joi.string().message({
          ...messages,
          "any.required": "이 필드는 필수입니다.",
        }),
        thumbUrl: Joi.string().message({
          ...messages,
          "any.required": "이 필드는 필수입니다.",
        }),
        movieUrl: Joi.string().message({
          ...messages,
          "any.required": "이 필드는 필수입니다.",
        }),
      });

      const validate = schema.validate(
        { title, category, desc, playtime, actor, genre, thumbUrl, movieUrl },
        { abortEarly: false }
      );

      if (validate.error) {
        throw Boom.badRequest(validate.error.message);
      } else {
        console.log("Validate input");
      }

      await this.adminService.postMovie({
        title,
        category,
        desc,
        playtime,
        actor,
        genre,
        thumbUrl,
        movieUrl,
      });
      return res.status(201).json({ message: "영상 등록을 완료했습니다." });
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
      const { movieId } = req.params;
      const {
        title,
        category,
        desc,
        playtime,
        actor,
        genre,
        thumbUrl,
        movieUrl,
      } = req.body;

      const updatedElement = {
        title: null,
        category: null,
        desc: null,
        playtime: null,
        actor: null,
        genre: null,
        thumbUrl: null,
        movieUrl: null,
      };
      if (movieId) {
        updatedElement.movieId = movieId;
      }
      if (title) {
        updatedElement.title = title;
      }
      if (category) {
        updatedElement.category = category;
      }
      if (desc) {
        updatedElement.desc = desc;
      }
      if (playtime) {
        updatedElement.playtime = playtime;
      }
      if (actor) {
        updatedElement.actor = actor;
      }
      if (genre) {
        updatedElement.genre = genre;
      }
      if (thumbUrl) {
        updatedElement.category = thumbUrl;
      }
      if (movieUrl) {
        updatedElement.category = movieUrl;
      }

      await this.adminService.updateMovie(updatedElement);
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
      const { movieId } = req.params;

      const movie = await this.adminService.findOneMovie({ movieId });
      if (!movie) {
        return res
          .status(404)
          .json({ errorMessage: "해당 ID의 영상이 존재하지 않습니다." });
      }

      await this.adminService.deleteMovie({ movieId });
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
