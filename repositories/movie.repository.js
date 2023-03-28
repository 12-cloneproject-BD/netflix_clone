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

    return {
      Genre: findGenre.dataValues.codename,
      videos: filteredVideos,
    };
  };

  //영상 상세조회
  FindOne = async (contentIdx) => {
    const findPerson = await CommonCodes.findAll({
      where: { codeUseColum: "person" },
      attributes: ["codename", "codeValue"],
    });

    const findOnesMovie = await Content.findOne({
      where: { contentIdx },
      attributes: [
        "contentIdx",
        "name",
        "videoUrl",
        "kind",
        "videoThumUrl",
        "Categories.genre", //여기서 불러올때는 데이터베이스의 이름과 동일해야함
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
      ],
    });

    const findAllPerson = await Participant.findAll({
      where: {
        contentIdx,
      },
      attributes: ["person"],
    });

    const personCodes = findPerson
      .filter((p) => {
        const codeValue = findAllPerson.find(
          (fp) => fp.person === p.dataValues.codeValue
        );
        return codeValue !== undefined;
      })
      .map((p) => p.dataValues.codename);
    return {
      [findOnesMovie.name]: findOnesMovie,
      actor: personCodes,
    };
  };

  //찜목록 조회
  savedVideo = async (profileIdx, viewLimit) => {
    const findMovies = await Content.findAll({
      raw: true,
      attributes: [
        "contentIdx",
        "name",
        "videoUrl",
        "videoThumUrl",
        "viewLimit",
      ],
      include: [
        {
          model: Save,
          where: {
            profileIdx: profileIdx,
          },
          attributes: ["profileIdx"], // Save 모델의 profileIdx 값도 반환
          required: true, // Save 모델과 조인 시 INNER JOIN을 사용하여 해당 조건에 맞는 값만 반환
        },
      ],
    });

    const filteredVideos = findMovies.filter((movie) => {
      return (
        movie.viewLimit === viewLimit ||
        (viewLimit === "VL000001" && movie.viewLimit === "VL000002")
      );
    });

    return filteredVideos;
  };

  //viewRank순 조회
  viewRank = async (profileIdx, viewLimit) => {
    const findMovies = await Content.findAll({
      raw: true,
      attributes: [
        "contentIdx",
        "name",
        "videoUrl",
        "videoThumUrl",
        "viewLimit",
      ],
      include: [
        {
          model: ViewRank,
          as: "ViewRanks",
          attributes: [],
        },
      ],
      order: [[Sequelize.literal("COUNT(ViewRanks.contentIdx)"), "DESC"]],
      group: ["Content.contentIdx"],
    });

    const filteredVideos = findMovies.filter((movie) => {
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
    // Get movies with the given contentIdx and likeRankIdx
    const findMovies = await Content.findAll({
      raw: true,
      attributes: [
        "contentIdx",
        "name",
        "videoUrl",
        "videoThumUrl",
        "viewLimit",
      ],
      include: [
        {
          model: LikeRank,
          Like,
          attributes: [],
        },
      ],
    });

    // Update the LikeRanks table with the likeCount
    const likeCount = await Like.count({ where: { contentIdx } });
    await LikeRank.upsert({ contentIdx, likeRankIdx, ProfileIdx });

    // Get the updated LikeRank data (sorted by likeCount in descending order)
    const likeRanks = await LikeRank.findAll({
      where: { likeRankIdx },
      order: [["likeCount", "DESC"]],
    });

    return { findMovies, likeRanks };
  };

  // likeRank = async (likeRankIdx, contentIdx) => {
  //   const findMovies = await Content.findAll({
  //     raw: true,
  //     where: { contentIdx },
  //     attributes: ["contentIdx", "name", "videoUrl", "videoThumUrl"],
  //     include: [
  //       {
  //         model: LikeRank,
  //         where: {
  //           [Op.and]: [{ likeRankIdx }, { contentIdx }],
  //         },
  //       },
  //     ],
  //   });
  //   const likeCount = await Like.count({ where: { contentIdx } });
  //   await LikeRank.upsert({ contentIdx, likeRankIdx, likeCount });

  //   const likeRanks = await LikeRank.findAll({
  //     where: { likeRankIdx },
  //     order: [["likeCount", "DESC"]], // sort by likeCount in descending order
  //   });
  //   return { findMovies, likeRanks };
  // };

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
