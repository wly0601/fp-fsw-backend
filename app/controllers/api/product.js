const productServices = require("../../services/product");
const categoryServices = require("../../services/categories");
const userServices = require("../../services/users");
const application = require("./application.js");

const {
  Categories,
  Users,
  Cities
} = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  async createProduct(req, res) {
    try {
      const {
        name,
        price,
        categoryId,
        description,
        images
      } = req.body;

      if (typeof price !== 'number') {
        res.status(400).json({
          status: "FAIL",
          message: "Price must be float!"
        });
        return;
      }

      const product = await productServices.create({
        name,
        sellerId: req.user.id,
        price,
        categoryId,
        description,
        images,
        statusId: 1,
        numberOfWishlist: 0,
      });

      res.status(201).json(product);
    } catch (err) {
      res.status(422).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

  async updateProduct(req, res) {
    try {
      const {
        name,
        price,
        categoryId,
        description,
        images
      } = req.body;

      const id = req.params.id;
      const product = await productServices.getOne({
        where: {
          id,
        }
      });

      if (!product) {
        res.status(404).json({
          status: "FAIL",
          message: `Product with id ${req.params.id} not found!`,
        });
        return;
      }

      const compareSellerId = req.user.id === product.sellerId;

      if (!compareSellerId) {
        res.status(401).json({
          status: "Unauthorized",
          message: "User who can edit their product is him/herself."
        });
        return;
      }

      if (typeof price !== 'number') {
        res.status(400).json({
          status: "FAIL",
          message: "Price must be float!"
        });
        return;
      }

      await productServices.update(req.params.id, {
        name,
        sellerId: req.user.id,
        price,
        categoryId,
        description,
        images,
      });

      res.status(201).json({
        status: "Success",
        message: `Product with id ${req.params.id} has been updated.`,
      });
    } catch (err) {
      res.status(422).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

  async listSellerProduct(req, res) {
    try {
      const {
        filterByStatusId = 1,
          page = 1,
          pageSize = 10
      } = req.query;

      const seller = await userServices.getOne({
        where: {
          id: req.params.id,
        },
        attributes: {
          exclude: ["encryptedPassword"]
        },
        include: {
          model: Cities,
          as: "city",
          attributes: ["name"]
        }
      });

      const products = await productServices.listByCondition({
        where: {
          statusId: filterByStatusId,
          sellerId: req.params.id,
        },
        offset: (page - 1) * pageSize,
        limit: pageSize
      });

      const productCount = await productServices.total({
        where: {
          statusId: filterByStatusId,
          sellerId: req.params.id
        }
      });

      const pagination = application.generatePagination(
        req,
        'listSellerProduct',
        productCount
      );

      res.status(200).json({
        seller,
        products,
        meta: {
          pagination,
        }
      });

    } catch (err) {
      res.status(400).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

  async getProduct(req, res) {
    try {
      const product = await productServices.getOne({
        where: {
          id: req.params.id
        },
        include: [{
            model: Users,
            as: "seller",
            attributes: {
              exclude: ["encryptedPassword"]
            },
            include: {
              model: Cities,
              as: "city",
              attributes: ["name"]
            }
          },
          {
            model: Categories,
            as: "category",
            attributes: ["name"]
          }
        ]
      });

      if (!product) {
        res.status(404).json({
          status: "FAIL",
          message: `Product with id ${req.params.id} not found!`,
        });
        return;
      }

      res.status(200).json(product);
    } catch (err) {
      res.status(400).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

  async getAllProducts(req, res) {
    try {
      const {
        page = 1,
          pageSize = 18
      } = req.query;

      const query = await application.getQuery(req);
      const products = await productServices.listByCondition(query);
      const productCount = await productServices.total({
        where: query.where,
        include: query.include
      });

      const pagination = application.generatePagination(
        req,
        'listProduct',
        productCount
      );

      res.status(200).json({
        products,
        meta: {
          pagination,
        }
      });
    } catch (err) {
      res.status(400).json({
        status: "FAIL",
        message: err.message
      });
    }
  },

  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await productServices.getOne({
        where: {
          id,
        }
      });

      if (!product) {
        res.status(404).json({
          status: "FAIL",
          message: `Product with id ${req.params.id} not found!`,
        });
        return;
      }

      const compareSellerId = req.user.id === product.sellerId;

      if (!compareSellerId) {
        res.status(401).json({
          status: "Unauthorized.",
          message: "User who can delete their product is him/herself."
        });
        return;
      }

      await productServices.delete(req.params.id);
      res.status(200).json({
        status: "OK",
        message: `Product with id ${req.params.id} has been deleted.`,
      });
    } catch (err) {
      res.status(400).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

};