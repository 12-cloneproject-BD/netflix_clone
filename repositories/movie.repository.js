const { Movies } = require("../models");

class MovieRepository extends Movies {
  constructor() {
    super();
  }
  //전체영상 조회
  FindAll = async () => {
    const findMovies = await Movies.findAll({
      attributes: ["movieId", "title", "movieUrl", "themUrl"],
    });
    return findMovies;
  };
  //카테고리별 조회
  //   moviesByCategory = async (categoryId) => {
  //     const findCategory = await Movies.findOne({
  //       where: { categoryId },
  //       attributes: [
  //         "movieId",
  //         "categoryId",
  //         "title",
  //         "movieUrl",
  //         "desc",
  //         "playtime",
  //       ],
  //     });
  //     return findCategory;
  //   };
  //영상 상세조회
  FindOne = async (categoryId, movieId) => {
    const findOnesMovie = await Movies.findOne({
      where: { categoryId },
      attributes: [
        "movieId",
        "categoryId",
        "title",
        "movieUrl",
        "genre",
        "actor",
        "desc",
        "playtime",
      ],
    });
    return findOnesMovie;
  };
}

module.exports = MovieRepository;
