const MovieService = require("../services/movie.service");
const Joi = require("joi");

class MovieController {
  constructor() {
    this.movieService = new MovieService();
  }
  //전체영상 조회
  allMovies = async (req, res, next) => {
    try {
      const { viewLimit } = res.locals.profile;
      const movie = await this.movieService.allMovies(viewLimit);
      res.status(200).json({ movies: movie });
    } catch (error) {
      next(error);
    }
  };

  //영상 카테고리 전달
  moviesCategory = async (req, res, next) => {
    try {
      const category = await this.movieService.moviesCategory();
      res.status(200).json({ genre: category });
    } catch (error) {
      next(error);
    }
  };

  // 카테고리별 조회
  videosByCategory = async (req, res, next) => {
    // try {
    const { genre } = req.params;
    const { viewLimit } = res.locals.profile;
    const category = await this.movieService.videosByCategory(genre, viewLimit);
    res.status(200).json({ category });
    // } catch (error) {
    //   next(error);
    // }
  };

  //영상 상세조회
  onesMovie = async (req, res, next) => {
    // try {
    const { contentIdx } = req.params;
    const findByMovie = await this.movieService.onesMovie(contentIdx);
    res.status(200).json({ movie: findByMovie });
    // } catch (error) {
    //   next(error);
    // }
  };

  //찜목록 조회
  savedVideo = async (req, res, next) => {
    // try {
    const { profileIdx } = res.locals.profile;
    const category = await this.movieService.savedVideo(profileIdx);
    res.status(200).json({ saved: category });
    // } catch (error) {
    //   next(error);
    // }
  };
  // savedVideo = async (req, res, next) => {
  //   // try {
  //   const { user } = res.locals.user;
  //   console.log(user);
  //   const category = await this.movieService.savedVideo();
  //   res.status(200).json({ saved: category });
  //   // } catch (error) {
  //   //   next(error);
  //   // }
  // };

  //viewRank순 조회
  viewRank = async (req, res, next) => {
    try {
      const { profileIdx } = res.locals.profile;
      const category = await this.movieService.viewRank(
        viewRankIdx,
        contentIdx
      );
      res.status(200).json({ category });
    } catch (error) {
      next(error);
    }
  };

  //likeRank순 조회
  likeRank = async (req, res, next) => {
    try {
      const { likeRankIdx, contentIdx } = req.params;
      const category = await this.movieService.likeRank(
        likeRankIdx,
        contentIdx
      );
      res.status(200).json({ category });
    } catch (error) {
      next(error);
    }
  };

  //viewHistory가 있을때 조회
  viewHistory = async (req, res, next) => {
    try {
      const { viewHistoryIdx, contentIdx } = req.params;
      const category = await this.movieService.viewHistory(
        viewHistoryIdx,
        contentIdx
      );
      res.status(200).json({ category });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = MovieController;
