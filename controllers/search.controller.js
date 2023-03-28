const SearchService = require("../services/search.service");

class SearchController {
  constructor() {
    this.searchService = new SearchService();
  }

  searchContents = async (req, res, next) => {
    try {
      const { searchText } = req.query;

      const searchContents = await this.searchService.SearchContents(
        searchText
      );

      return res.status(200).json({ searchContents: searchContents });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = SearchController;
