const MovieService = require("../services/movie.service");
const Joi = require("joi");
const Boom = require("boom");

class MovieController {
  constructor() {
    this.movieService = new MovieService();
  }
  //전체영상 조회
  allMovies = async (req, res, next) => {
    try {
      const { viewLimit } = res.locals.profile;
      const movie = await this.movieService.allMovies(viewLimit);
      res.status(200).json({ allVideos: movie });
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
    try {
      const { genre } = req.params;
      const { viewLimit } = res.locals.profile;
      const category = await this.movieService.videosByCategory(
        genre,
        viewLimit
      );
      res.status(200).json({ category });
    } catch (error) {
      next(error);
    }
  };

  //영상 상세조회
  onesMovie = async (req, res, next) => {
    // try {
    const { contentIdx } = req.params;
    const findByMovie = await this.movieService.onesMovie(contentIdx);
    res.status(200).json({ detailVideo: findByMovie });
    // } catch (error) {
    //   next(error);
    // }
  };

  //찜목록 조회
  savedVideo = async (req, res, next) => {
    try {
      const { profileIdx, viewLimit } = res.locals.profile;
      const category = await this.movieService.savedVideo(
        profileIdx,
        viewLimit
      );
      res.status(200).json({ savedVideo: category });
    } catch (error) {
      next(error);
    }
  };

  //viewRank순 조회
  viewRank = async (req, res, next) => {
    try {
      const { profileIdx, viewLimit } = res.locals.profile;
      const category = await this.movieService.viewRank(profileIdx, viewLimit);
      res.status(200).json({ viewRank: category });
    } catch (error) {
      next(error);
    }
  };

  //likeRank순 조회
  likeRank = async (req, res, next) => {
    // try {
    const { profileIdx, viewLimit } = res.locals.profile;
    const category = await this.movieService.likeRank(profileIdx, viewLimit);
    res.status(200).json({ category });
    // } catch (error) {
    //   next(error);
    // }
  };

  //viewHistory가 있을때 조회
  viewHistory = async (req, res, next) => {
    // try {
    const { profileIdx } = res.locals.profile;
    const viewHistory = await this.movieService.viewHistory(
      profileIdx
    );
    res.status(200).json({ viewHistory });
    // } catch (error) {
    //   next(error);
    // }
  };

  // 영상 재생 - (+ 시청 기록 + 내가 본 재생 기록)
  viewContent = async (req, res, next) => {
    try{
      const { profileIdx } = res.locals.profile;
      const { contentIdx } = req.params;

      const viewContent = await this.movieService.viewContent(contentIdx);
      await this.movieService.viewIncrease(profileIdx, contentIdx);
      await this.movieService.viewRecordHistory(profileIdx, contentIdx);

      res.status(200).json({ viewContent });
    }catch(err) {
      next(err);
    }
  }

  pickThisContent = async (req, res, next) => {
    try{
      const { profileIdx } = res.locals.profile;
      const { contentIdx } = req.params;

      const pickThisContent = await this.movieService.pickThisContent(profileIdx, contentIdx);

      if(pickThisContent === 'create'){
        res.status(200).json({ message: '이 영화를 좋아요 카테고리에 추가했습니다.' });
      }else{
        res.status(200).json({ message: '이 영화를 좋아요 카테고리에서 제거했습니다.' });
      }
    }catch(err) {
      next(err);
    }
  }

}

module.exports = MovieController;
