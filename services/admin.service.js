const AdminRepository = require("../repositories/admin.repository");
const Boom = require("boom");

class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  postMovie = async ({
    title,
    category,
    desc,
    playtime,
    actor,
    genre,
    thumbUrl,
    movieUrl,
  }) => {
    try {
      if (
        !title ||
        !category ||
        !desc ||
        !playtime ||
        !actor ||
        !genre ||
        !thumbUrl ||
        !movieUrl
      ) {
        throw Boom.preconditionFailed("데이터 형식이 올바르지 않습니다.");
      }
      await this.adminRepository.postMovie({
        title,
        category,
        desc,
        playtime,
        actor,
        genre,
        thumbUrl,
        movieUrl,
      });
    } catch (error) {
      throw Boom.preconditionFailed("영상 등록에 실패하였습니다.");
    }
  };

  updateMovie = async ({
    movieId,
    title,
    category,
    desc,
    playtime,
    actor,
    genre,
    thumbUrl,
    movieUrl,
  }) => {
    try {
      const movie = await this.adminRepository.findOneMovie({ movieId });
      if (!movie) {
        return res
          .status(404)
          .json({ errorMessage: "해당 ID의 영상이 존재하지 않습니다." });
      }

      let updatedMovie;
      if (title) {
        updatedMovie = await movie.update({ title });
      }
      if (category) {
        updatedMovie = await movie.update({ category });
      }
      if (desc) {
        updatedMovie = await movie.update({ desc });
      }
      if (playtime) {
        updatedMovie = await movie.update({ playtime });
      }
      if (actor) {
        updatedMovie = await movie.update({ actor });
      }
      if (genre) {
        updatedMovie = await movie.update({ genre });
      }
      if (thumbUrl) {
        updatedMovie = await movie.update({ thumbUrl });
      }
      if (movieUrl) {
        updatedMovie = await movie.update({ movieUrl });
      }

      return updatedMovie;
    } catch (error) {
      throw Boom.preconditionFailed("영상 정보 수정에 실패하였습니다.");
    }
  };

  deleteMovie = async ({ movieId }) => {
    try {
      const movie = await this.adminRepository.findOneMovie({ movieId });
      if (!movie) {
        return res
          .status(404)
          .json({ errorMessage: "해당 ID의 영상이 존재하지 않습니다." });
      }

      await this.adminRepository.deleteMovie({ movieId });
    } catch (error) {
      throw Boom.preconditionFailed("영상 삭제에 실패하였습니다.");
    }
  };
}

module.exports = AdminService;
