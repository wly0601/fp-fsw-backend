const categoryServices = require("../../services/categories");
const { Op } = require("sequelize");
const {
  Categories,
  Cities,
  Users
} = require("../../models");

module.exports = {
  getRoot(req, res) {
    res.status(200).json({
      status: "OK",
      message: "Second Hand API is up and running!",
    });
  },

  handleNotFound(req, res) {
    const err = new Error("Root Not Found!");
    res.status(404).json({
      error: {
        name: err.name,
        message: err.message,
        details: err.details,
      }
    });
  },

  getOffset(req, count) {
    const { page = 1, pageSize = 16 } = req.query;
    const offset = (page - 1) * pageSize;
    return offset;
  },

  generatePagination(req, from, count) {
    var pageBefore, pageSizeBefore;
    if (from === 'listProduct') {
      pageBefore = 1;
      pageSizeBefore = 18;
    } else {
      pageBefore = 1;
      pageSizeBefore = 10;
    }

    const { page = pageBefore, pageSize = pageSizeBefore } = req.query;
    const numberOfPage = Math.ceil(count / pageSize);

    return {
      page,
      numberOfPage,
      pageSize,
      count
    };
  },

  handleSearchQuery(req) {
    const querySearch = req.query.search.split(' ');
    const comparison = [];

    for (let i = 0; i < querySearch.length; i++) {
      comparison.push({
        name: {
          [Op.iLike]: '%' + querySearch[i],
        }
      }, {
        name: {
          [Op.iLike]: querySearch[i] + '%'
        }
      });
    }

    for (let i = 0; i < querySearch.length; i++) {
      comparison.push({
        '$seller.city.name$': {
          [Op.iLike]: '%' + querySearch[i] + '%',
        },
      });
    }
    return comparison;
  },

  async getQuery(req) {
    const {
      category,
      search
    } = req.query;
    const offset = this.getOffset(req);
    const limit = req.query.pageSize || 18;
    const order = [
      ["numberOfWishlist", "DESC"],
      ["price", "ASC"]
    ];

    const statusId = {
      [Op.ne]: 3
    };

    var where = {
      statusId
    };

    const include = [{
        model: Categories,
        as: "category",
        attributes: ["name"]
      },
      {
        model: Users,
        as: 'seller',
        attributes: {
          exclude: ["encryptedPassword"],
        },
        include: {
          model: Cities,
          as: 'city',
          attributes: ["name"],
        }
      }
    ];

    if (category) {
      const getCategoryName = await categoryServices.getOne({
        where: {
          name: {
            [Op.iLike]: category
          }
        }
      });

      if (!!getCategoryName) {
        where.categoryId = getCategoryName.id;
      }
    }

    var getSearchResult;
    if (!!search) {
      getSearchResult = await this.handleSearchQuery(req);
    }

    if (!!getSearchResult) {
      where = {
        statusId,
        [Op.or]: getSearchResult
      };
    }

    // console.log(getSearchResult)

    const query = {
      where,
      include,
      offset,
      limit,
      order
    };

    return query;
  },
};