const {
  Content,
  Participant,
  Category,
  Save,
  ViewRank,
  LikeRank,
  CommonCodes,
  ViewHistory,
  Profile,
  Like,
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
      Video: findOnesMovie,
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
          as: "LikeRanks",
          attributes: [],
        },
      ],
      order: [[Sequelize.literal("COUNT(LikeRanks.contentIdx)"), "DESC"]],
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

    return { rankedVideos };
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


  // where: { codeUseColum: "person" },
  // attributes: ["codename", "codeValue"],

  /**
   * 내가 본 영상 리스트 조회
   * @param {String} profileIdx
   * @returns 내가 본 영상 배열
   */
  viewHistory = async (profileIdx) => {
    const findContentKey = await ViewHistory.findAll({
      where: {
        profileIdx
      },
      attributes: ["contentIdx"],
      order: [["viewtime", "DESC"]],
    });

    const contentIdxs = findContentKey.map((history) => history.contentIdx);

    const findMovies = await Content.findAll({
      attributes: ["contentIdx", "name", "videoUrl", "videoThumUrl"],
      where: {
        contentIdx: contentIdxs,
      },
      order: [
        [Sequelize.literal(`FIELD(contentIdx, '${contentIdxs.join("','")}')`)]
      ]
    });

    return findMovies;
  };

  /**
   * 영상 재생
   * @param {String} contentIdx
   * @returns 영상 정보 contentIdx, name, videoUrl, videoThumUrl
   */
  viewContent = async (contentIdx) => {
    const viewContent = await Content.findOne({
      attributes: ["contentIdx", "name", "videoUrl", "videoThumUrl"],
      where: {
        contentIdx,
      },
    });
    return viewContent;
  };

  /**
   * 영상 조회 횟수 증가
   * @param {String} profileIdx
   * @param {String} contentIdx
   * @returns 방금 조회수 증가시킨 데이터
   */
  viewIncrease = async (profileIdx, contentIdx) => {
    const viewIncrease = await ViewRank.create({
      profileIdx,
      contentIdx,
    });
    return viewIncrease;
  };

  /**
   * 내가 본 영상 기록 남기기
   * @param {String} profileIdx
   * @param {String} contentIdx
   * @return 기록 작성 (create) /수정 데이터 (update)
   */
  viewRecordHistory = async (profileIdx, contentIdx) => {

    let updateRecordHistory = await ViewHistory.findOrCreate({
      where: {
        [Op.and]: [{ profileIdx }, { contentIdx }],
      },
      defaults: {
        profileIdx,
        contentIdx,
        viewtime: new Date(),
      },
    }).then(([data, created]) => {
      if (!created) {
        // 데이터 존재
        return 'update'
      }else{
        return 'create';
      }
    });

    if(updateRecordHistory === 'update'){
      await ViewHistory.update(
        {
          viewtime: new Date()
        },
        {
          where: {
            [Op.and]: [{ profileIdx }, { contentIdx }],
          }
        }
      )
      updateRecordHistory = 'update'
    }

    return updateRecordHistory;
  };

  /**
   * 이 컨텐츠 좋아요
   * @param {String} profileIdx
   * @param {String} contentIdx
   * @return 'delete' or 'create'
   */
  pickThisContent = async (profileIdx, contentIdx) => {
    const updateContentLike = await Like.findOrCreate({
      where: {
        [Op.and]: [{ profileIdx }, { contentIdx }],
      },
      defaults: {
        profileIdx,
        contentIdx,
        viewTime: new Date()
      },
    }).then(([data, created]) => {
      if (!created) {
        // 데이터가 존재
        data.destroy();
        return "delete";
      }
      return "create";
    });

    return updateContentLike;
  };

  /**
   * 좋아요 카운트 높이기
   * @param {*} profileIdx 
   * @param {*} contentIdx 
   * @return 이미 카운팅된 LikeRank 정보 (skip) or 새로 카운팅된 LikeRank 정보 (create)
   */
  pickContentIncrease = async(profileIdx, contentIdx) => {
    const searchInfo = await LikeRank.findOne({
      where: {
        [Op.and]: [{ profileIdx }, { contentIdx }]
      },
    })

    if(!searchInfo){
      // 해당 계정으로 좋아요 한 경우 없는 경우
      const likeInfo = await LikeRank.create({
        profileIdx, contentIdx
      })

      return 'create';
    }

    return 'skip';
  }

  /**
   * 좋아요 카운트 낮추기
   * @param {*} profileIdx 
   * @param {*} contentIdx 
   * @return 이미 카운팅된 LikeRank 정보 (skip) or 카운팅 제거한 LikeRank 정보 (destroy)
   */
  pickContentdecrease = async(profileIdx, contentIdx) => {
    const searchInfo = await LikeRank.findOne({
      where: {
        [Op.and]: [{ profileIdx }, { contentIdx }]
      },
    })

    if(searchInfo){
      // 해당 계정으로 좋아요 한 경우 있는 경우
      const likeInfo = await LikeRank.destroy({
        where: {
          [Op.and]: [{ profileIdx }, { contentIdx }]
        },
      })

      return 'destroy';
    }

    return 'skip';
  }
}

module.exports = MovieRepository;
