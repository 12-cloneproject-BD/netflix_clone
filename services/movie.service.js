const MovieRepository = require("../repositories/movie.repository");
const Boom = require("boom");

class MovieService {
  constructor() {
    this.movieRepository = new MovieRepository();
  }
  //전체영상 조회
  allMovies = async (viewLimit) => {
    const movie = await this.movieRepository.FindAll(viewLimit);
    return movie;
  };

  //영상 카테고리 전달
  moviesCategory = async () => {
    const category = await this.movieRepository.FindCategory();
    if (!category) {
      throw Boom.notFound("카테고리가 존재하지 않습니다.", false);
    }
    return category;
  };

  //카테고리별 조회
  videosByCategory = async (genre, viewLimit) => {
    if (!genre) {
      throw Boom.notFound("카테고리가 존재하지 않습니다.", false);
    }
    const videoList = await this.movieRepository.videosByCategory(
      genre,
      viewLimit
    );

    return videoList;
  };

  //영상 상세조회
  onesMovie = async (contentIdx) => {
    const movie = await this.movieRepository.FindOne(contentIdx);
    if (!movie) {
      throw Boom.notFound("영상이 존재하지 않습니다.", false);
    }
    return movie;
  };

  //찜목록 조회
  savedVideo = async (profileIdx) => {
    const category = await this.movieRepository.savedVideo(profileIdx);
    // if (!category) {
    //   throw Boom.notFound("찜목록이 존재하지 않습니다.", false);
    // }
    return category;
  };

  //viewRank순 조회
  viewRank = async (viewRankIdx, contentIdx) => {
    const category = await this.movieRepository.viewRank(
      viewRankIdx,
      contentIdx
    );
    if (!category) {
      throw Boom.notFound("카테고리가 존재하지 않습니다.", false);
    }
    return category;
  };

  //likeRank순 조회
  likeRank = async (likeRankIdx, contentIdx) => {
    const category = await this.movieRepository.likeRank(
      likeRankIdx,
      contentIdx
    );
    if (!category) {
      throw Boom.notFound("카테고리가 존재하지 않습니다.", false);
    }
    return category;
  };

  //viewHistory가 있을때 조회
  viewHistory = async (viewHistoryIdx, contentIdx) => {
    const category = await this.movieRepository.viewHistory(
      viewHistoryIdx,
      contentIdx
    );
    if (!category) {
      throw Boom.notFound("카테고리가 존재하지 않습니다.", false);
    }
    return category;
  };
}

module.exports = MovieService;
