const MovieService = require("../services/movie.service");
const Joi = require("joi");

class MovieController {
  constructor() {
    this.movieService = new MovieService();
  }
  //전체영상 조회
  allMovies = async (req, res, next) => {
    try {
      const movie = await this.movieService.allMovies();
      res.status(200).json({ movies: movie });
    } catch (error) {
      next(error);
    }
  };
  //카테고리별 조회
  //   moviesByCategory = async (req, res, next) => {
  //     try {
  //          const {categoryId} = req.params;
  //       const category = await this.movieService.moviesByCategory(categoryId);
  //       res.status(200).json({ category });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
  //영상 상세조회
  onesMovie = async (req, res, next) => {
    try {
      const { categoryId, movieId } = req.params;
      const findByMovie = await this.movieService.onesMovie(
        categoryId,
        movieId
      );
      res.status(200).json({ movie: findByMovie });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = MovieController;
