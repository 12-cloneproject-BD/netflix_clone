const MovieRepository = require("../repositories/movie.repository");
const Boom = require("boom");

class MovieService {
  constructor() {
    this.movieRepository = new MovieRepository();
  }
  //전체영상 조회
  allMovies = async () => {
    const movie = await this.movieRepository.FindAll();
    return movie;
  };
  //카테고리별 조회
  //   moviesByCategory = async (categoryId) => {
  //     const category = await this.movieRepository.moviesByCategory(categoryId);
  //     if (!category) {
  //       throw Boom.notFound("카테고리가 존재하지 않습니다.", false);
  //     }
  //     return category;
  //   };
  //영상 상세조회
  onesMovie = async (categoryId, movieId) => {
    const movie = await this.movieRepository.FindOne(categoryId, movieId);
    if (!movie) {
      throw Boom.notFound("영상이 존재하지 않습니다.", false);
    }
    return movie;
  };
}
