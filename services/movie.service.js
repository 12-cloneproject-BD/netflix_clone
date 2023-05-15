const MovieRepository = require("../repositories/movie.repository");
const Boom = require("boom");

class MovieService {
  constructor() {
    this.movieRepository = new MovieRepository();
  }
  //전체영상 조회
  allMovies = async (viewLimit) => {
    const movie = await this.movieRepository.FindAll(viewLimit);
    const filteredMovies = movie.filter((movies) => {
      return (
        movies.viewLimit === viewLimit ||
        (viewLimit === "VL000001" && movies.viewLimit === "VL000002")
      );
    });
    return filteredMovies;
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
    if (!videoList.findGenre) {
      throw new Error(`No matching genre: ${genre}`);
    }
    const categoryList = await this.movieRepository.findCategoryList(videoList);
    const filteredVideos = findCategory.filter((movie) => {
      return (
        movie.viewLimit === viewLimit ||
        (viewLimit === "VL000001" && movie.viewLimit === "VL000002")
      );
    });

    return {
      Genre: videoList.dataValues.codename,
      videos: filteredVideos,
    };
  };

  //영상 상세조회
  onesMovie = async (contentIdx) => {
    const movie = await this.movieRepository.FindOne(contentIdx);
    if (!movie) {
      throw Boom.notFound("영상이 존재하지 않습니다.", false);
    }
    const [findPerson, findOnesMovie, findAllPerson] = movie;
    const personCodes = findPerson
      .filter((p) => {
        const codeValue = findAllPerson.find(
          (fp) => fp.person === p.dataValues.codeValue
        );
        return codeValue !== undefined;
      })
      .map((p) => p.dataValues.codename);
    return {
      Video: findOnesMovie,
      actor: personCodes,
    };
  };

  //찜목록 조회
  savedVideo = async (profileIdx, viewLimit) => {
    const category = await this.movieRepository.savedVideo(
      profileIdx,
      viewLimit
    );
    if (!category) {
      throw Boom.notFound("찜목록이 존재하지 않습니다.", false);
    }
    const filteredVideos = category.filter((movie) => {
      return (
        movie.viewLimit === viewLimit ||
        (viewLimit === "VL000001" && movie.viewLimit === "VL000002")
      );
    });
    return filteredVideos;
  };

  //viewRank순 조회
  viewRank = async (profileIdx, viewLimit) => {
    const category = await this.movieRepository.viewRank(profileIdx, viewLimit);
    if (!category) {
      throw Boom.notFound("카테고리가 존재하지 않습니다.", false);
    }
    const filteredVideos = category.filter((movie) => {
      return (
        movie.viewLimit === viewLimit ||
        (viewLimit === "VL000001" && movie.viewLimit === "VL000002")
      );
    });

    const rankedVideos = filteredVideos.map((movie, index) => {
      return {
        ...movie,
        rank: index + 1,
      };
    });
    return rankedVideos;
  };

  //likeRank순 조회
  likeRank = async (profileIdx, viewLimit) => {
    const category = await this.movieRepository.likeRank(profileIdx, viewLimit);
    if (!category) {
      throw Boom.notFound("카테고리가 존재하지 않습니다.", false);
    }
    const filteredVideos = category.filter((movie) => {
      return (
        movie.viewLimit === viewLimit ||
        (viewLimit === "VL000001" && movie.viewLimit === "VL000002")
      );
    });

    const rankedVideos = filteredVideos.map((movie, index) => {
      return {
        ...movie,
        rank: index + 1,
      };
    });
    return rankedVideos;
  };

  /**
   * 내가 본 영상 리스트 조회
   * @param {String} profileIdx
   * @returns 내가 본 영상 배열
   */
  viewHistory = async (profileIdx) => {
    const category = await this.movieRepository.viewHistory(profileIdx);
    if (!category) {
      throw Boom.notFound("카테고리가 존재하지 않습니다.", false);
    }
    return category;
  };

  /**
   * 영상 재생
   * @param {String} contentIdx
   * @returns 영상 정보 contentIdx, name, videoUrl, videoThumUrl
   */
  viewContent = async (contentIdx) => {
    const viewContent = await this.movieRepository.viewContent(contentIdx);
    if (!viewContent) {
      throw Boom.notFound("영상이 존재하지 않습니다.", false);
    }
    return viewContent;
  };

  /**
   * 영상 조회 횟수 증가
   * @param {String} profileIdx
   * @param {String} contentIdx
   * @returns 방금 조회수 증가시킨 데이터
   */
  viewIncrease = async (profileIdx, contentIdx) => {
    const viewIncrease = await this.movieRepository.viewIncrease(
      profileIdx,
      contentIdx
    );
    return viewIncrease;
  };

  /**
   * 내가 본 영상 기록 남기기
   * @param {String} profileIdx
   * @param {String} contentIdx
   * @return 기록 작성 (create) /수정 데이터 (update)
   */
  viewRecordHistory = async (profileIdx, contentIdx) => {
    const viewRecordHistory = await this.movieRepository.viewRecordHistory(
      profileIdx,
      contentIdx
    );
    return viewRecordHistory;
  };

  /**
   * 이 컨텐츠 좋아요
   * @param {String} profileIdx
   * @param {String} contentIdx
   * @return 'delete' or 'create'
   */
  pickThisContent = async (profileIdx, contentIdx) => {
    const pickThisContent = await this.movieRepository.pickThisContent(
      profileIdx,
      contentIdx
    );

    if (pickThisContent === "create") {
      // 좋아요 한 경우 likeRank +
      await this.movieRepository.pickContentIncrease(profileIdx, contentIdx);
    } else {
      // 좋아요 취소 한 경우 likeRank -
      await this.movieRepository.pickContentdecrease(profileIdx, contentIdx);
    }

    return pickThisContent;
  };
}

module.exports = MovieService;
