const {
  Content,
  Participant,
  Category,
  Save,
  ViewRank,
  LikeRank,
  CommonCodes,
  Profile,
} = require("../models");
const { Op, Sequelize } = require("sequelize");

class MovieRepository extends Content {
  constructor() {
    super();
  }

  //전체영상 조회
  FindAll = async (viewLimit) => {
    const movies = await Content.findAll({
      attributes: [
        "contentIdx",
        "name",
        "videoUrl",
        "videoThumUrl",
        "viewLimit",
      ],
    });

    const filteredMovies = movies.filter((movie) => {
      return (
        movie.viewLimit === viewLimit ||
        (viewLimit === "VL000001" && movie.viewLimit === "VL000002")
      );
    });

    return filteredMovies;
  };

  //영상 카테고리 전달
  FindCategory = async () => {
    const findCategory = await CommonCodes.findAll({
      attributes: ["codeValue", "codeName"],
    });
    return findCategory;
  };

  //카테고리별 조회
  videosByCategory = async (genre, viewLimit) => {
    const findGenre = await CommonCodes.findOne({
      where: { codeUseColum: "genre", codeValue: genre },
      attributes: ["codename", "codeValue"],
    });

    if (!findGenre) {
      throw new Error(`No matching genre: ${genre}`);
    }

    const findCategory = await Content.findAll({
      raw: true,
      attributes: [
        "name",
        "videoUrl",
        "videoThumUrl",
        "contentIdx",
        "viewLimit",
      ],
      include: [
        {
          model: Category,
          as: "Categories",
          attributes: ["genre"],
          where: {
            genre: findGenre.dataValues.codeValue,
          },
        },
      ],
    });

    const filteredVideos = findCategory.filter((movie) => {
      return (
        movie.viewLimit === viewLimit ||
        (viewLimit === "VL000001" && movie.viewLimit === "VL000002")
      );
    });

    return { filteredVideos };
  };

  //영상 상세조회
  FindOne = async (contentIdx) => {
    const findOnesMovie = await Content.findOne({
      where: { contentIdx },
      attributes: [
        "contentIdx",
        "name",
        "videoUrl",
        "kind",
        "videoThumUrl",
        "Categories.genre", //여기서 불러올때는 데이터베이스의 이름과 동일해야함
        "Participants.person",
        "desc",
        "playtime",
        "status",
      ],
      raw: true,
      include: [
        {
          model: Category,
          attributes: [],
        },
        {
          model: Participant,
          attributes: [],
        },
      ],
    });
    return findOnesMovie;
  };

  //찜목록 조회
  savedVideo = async (profileIdx) => {
    const findMovies = await Content.findAll({
      raw: true,
      attributes: ["contentIdx", "name", "videoUrl", "videoThumUrl"],
      include: [
        {
          model: Save,
          where: {
            [Op.and]: [{ profileIdx }],
          },
          attributes: [], // 추가한 옵션
        },
      ],
    });
    return findMovies;
  };

  // savedVideo = async (profileIdx) => {
  //   const findMovies = await Content.findAll({
  //     raw: true,
  //     attributes: ["contentIdx", "name", "videoUrl", "videoThumUrl"],
  //     include: [
  //       {
  //         model: Save,
  //         where: {
  //           [Op.and]: [{ "Saves.profileIdx": profilIdx }, { profileIdx }],
  //         },
  //         attributes: [], // 추가한 옵션
  //       },
  //     ],
  //   });
  //   return findMovies;
  // };

  //viewRank순 조회
  viewRank = async (viewRankIdx, contentIdx) => {
    console.log(viewRankIdx);
    const findMovies = await Content.findAll({
      raw: true,
      where: { contentIdx },
      attributes: ["contentIdx", "name", "videoUrl", "videoThumUrl"],
      limit: 10,
      include: [
        {
          model: ViewRank,
          where: {
            [Op.and]: [{ viewRankIdx }, { contentIdx }],
          },
          attributes: [], //값을 설정해주지않으면 viewRank의 모든 값이나오게된다.
        },
      ],
    });
    return findMovies;
  };

  //likeRank순 조회
  likeRank = async (likeRankIdx, contentIdx) => {
    const findMovies = await Content.findAll({
      raw: true,
      where: { contentIdx },
      attributes: ["contentIdx", "name", "videoUrl", "videoThumUrl"],
      limit: 10,
      include: [
        {
          model: LikeRank,
          where: {
            [Op.and]: [{ likeRankIdx }, { contentIdx }],
          },
        },
      ],
    });
    return findMovies;
  };

  //viewHistory가 있을때 조회
  viewHistory = async (viewHistoryIdx, contentIdx) => {
    const findMovies = await Content.findAll({
      raw: true,
      where: { contentIdx },
      attributes: ["contentIdx", "name", "videoUrl", "videoThumUrl"],
      limit: 10,
      include: [
        {
          model: this.viewHistory,
          where: {
            [Op.and]: [{ contentIdx }, { viewHistoryIdx }],
          },
        },
      ],
    });
    return findMovies;
  };
}

module.exports = MovieRepository;
