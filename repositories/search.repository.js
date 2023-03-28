const { Content } = require("../models");
const { Op } = require("sequelize");

class SearchRepository extends Content {
  constructor() {
    super();
  }
  /**
   * 검색 결과 조회
   * @param {String} searchText
   * @returns searchContents 검색 결과 콘텐츠
   */
  SearchContents = async (searchText) => {
    const searchContents = await Content.findAll({
      attributes: ["contentIdx", "name", "videoUrl", "videoThumUrl"],
      where: {
        name: {
          [Op.like]: `%${searchText}%`,
        },
      },
      order: ["createdAt", "desc"],
    });
    return searchContents;
  };

  /**
   * 검색 결과 중 가장 최근 데이터 조회
   * @param {String} searchText
   * @returns searchContents 검색 결과 콘텐츠
   */
  SearchCurrentContents = async (searchText) => {
    const searchCurrentContents = await Content.findAll({
      attributes: ["contentIdx", "name", "videoUrl", "videoThumUrl"],
      where: {
        name: {
          [Op.like]: `%${searchText}%`,
        },
      },
      order: ["createdAt", "DESC"],
      limit: 1,
    });

    return searchCurrentContents;
  };
}

module.exports = SearchRepository;
