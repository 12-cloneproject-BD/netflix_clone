const AdminRepository = require("../repositories/admin.repository");
const Boom = require("boom");
const _ = require('lodash');

class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  postMovie = async ({
    name,
    kind,
    desc,
    viewLimit,
    playtime,
    status,
    videothumbUrl,
    videoUrl,
  }) => {
    try {
      if (
        !name ||
        !kind ||
        !desc ||
        !viewLimit ||
        !playtime ||
        !status ||
        !videothumbUrl ||
        !videoUrl
      ) {
        throw Boom.preconditionFailed("데이터 형식이 올바르지 않습니다.");
      }
      await this.adminRepository.postMovie({
        name,
        kind,
        desc,
        viewLimit,
        playtime,
        status,
        videothumbUrl,
        videoUrl,
      });
    } catch (error) {
      throw Boom.preconditionFailed("영상 등록에 실패하였습니다.");
    }
  };

  updateMovie = async ({
    contentIdx,
    name,
    kind,
    desc,
    viewLimit,
    playtime,
    status,
    videothumbUrl,
    videoUrl,
  }) => {
    try {
      const movie = await this.adminRepository.findOneMovie({ contentIdx });
      if (!movie) {
        return res
          .status(404)
          .json({ errorMessage: "해당 ID의 영상이 존재하지 않습니다." });
      }

      const updatedValues = _.pickBy({
        contentIdx, name, kind, desc, playtime, viewLimit, status, videoUrl, videothumbUrl
      }, _.identity);

      const updatedMovie = await this.adminRepository.updateMovie(updatedValues);
      return updatedMovie;
    } catch (error) {
      throw Boom.preconditionFailed("영상 정보 수정에 실패하였습니다.");
    }
  };

  deleteMovie = async ({ contentIdx }) => {
    try {
      const movie = await this.adminRepository.findOneMovie({ contentIdx });
      if (!movie) {
        return res
          .status(404)
          .json({ errorMessage: "해당 ID의 영상이 존재하지 않습니다." });
      }

      await this.adminRepository.deleteMovie({ contentIdx });
    } catch (error) {
      throw Boom.preconditionFailed("영상 삭제에 실패하였습니다.");
    }
  };
}

module.exports = AdminService;
