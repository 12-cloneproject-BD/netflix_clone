const { Movies } = require("../models");
const { Op } = require("sequelize");

class AdminRepository {
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
    await Movies.create({
      title,
      category,
      desc,
      playtime,
      actor,
      genre,
      thumbUrl,
      movieUrl,
    });
  };

  findOneMovie = async ({ movieId }) => {
    const movie = await Movies.findOne({ where: { movieId } });
    return movie;
  };

  deleteMovie = async ({ movieId }) => {
    await Movies.destroy({ where: { movieId } });
    return;
  };
}

module.exports = AdminRepository;
