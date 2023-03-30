const { Content } = require("../models");
const { Op } = require("sequelize");
const _ = require('lodash');

class AdminRepository {
  postMovie = async ({
    name,
    kind,
    desc,
    playtime,
    viewLimit,
    status,
    videothumbUrl,
    videoUrl,
  }) => {
    const createdMovie = await Content.create({
      name,
      kind,
      desc,
      playtime,
      viewLimit,
      status,
      videothumbUrl,
      videoUrl,
    });
    return createdMovie;
  };

  updateMovie = async ({
    contentIdx,
    name,
    kind,
    desc,
    playtime,
    viewLimit,
    status,
    videothumbUrl,
    videoUrl,
  }) => {
    const updatedValues = _.pickBy({
      name,
      kind,
      desc,
      playtime,
      viewLimit,
      status,
      videothumbUrl,
      videoUrl,
    });
    const updatedMovie  = await Content.update(updatedValues, { where: {contentIdx} });
    return updatedMovie;
  };

  findOneMovie = async ({ contentIdx }) => {
    const movie = await Content.findOne({ where: { contentIdx } });
    return movie;
  };

  deleteMovie = async ({ contentIdx }) => {
    await Content.destroy({ where: { contentIdx } });
    return;
  };
}

module.exports = AdminRepository;
