const SearchRepository = require("../repositories/search.repository");
const Boom = require("boom");
const RedisConnector = require("../modules/redisConnector");
const redis = require("redis");
const { promisify } = require("util");
const { Op } = require("sequelize");

class SearchService {
  constructor() {
    this.searchRepository = new SearchRepository();
    this.redisClient = RedisConnector.getClient();
  }

  /**
   * 영화 검색
   * @param {String} searchText
   * @returns
   */
  SearchContents = async (searchText) => {
    const contentsBox =
      JSON.parse(await this.redisClient.get(`search:${searchText}`)) ?? [];

    if (contentsBox.length > 0) {
      const searchContents = await this.searchRepository.SearchCurrentContents(
        searchText
      );

      if (
        searchContents[0].dataValues.contentIdx === contentsBox[0].contentIdx
      ) {
        return contentsBox;
      }
    }

    const searchContents = await this.searchRepository.SearchContents(
      searchText
    );

    const searchResults = searchContents.map((content) => content.dataValues);

    this.redisClient.set(
      `search:${searchText}`,
      JSON.stringify(searchResults),
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Data stored in Redis:", result);
        }
      }
    );
    // 60초가 지나면 소멸
    this.redisClient.expire(`search:${searchText}`, 60);

    return searchContents;
  };
}

module.exports = SearchService;
