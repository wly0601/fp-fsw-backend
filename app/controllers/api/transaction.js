const transactionServices = require("../../services/transaction");
const productServices = require("../../services/product");
const application = require("./application");
const {
  Products,Users,Cities
} = require("../../models")
const {
  Op
} = require("sequelize");

module.exports = {
  async createTransaction(req, res) {
    try {
      const {
        bargainPrice,
        productId
      } = req.body
      const dateOfBargain = new Date()
      const product = await productServices.get(productId)

      const transaction = await transactionServices.create({
        productId: product.id,
        buyerId: req.user.id,
        bargainPrice,
        dateOfBargain,
      });

      await productServices.update(productId, {
        statusId: 2,
        numberOfWishlist: product.numberOfWishlist + 1,
      })

      res.status(201).json(transaction);
    } catch (err) {
      res.status(422).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

  async getTransactionById(req, res) {
    try {
      const transaction = await transactionServices.get(req.params.id)

      if (!transaction) {
        res.status(404).json({
          status: "FAIL",
          message: `Transaction with id ${req.params.id} not found!`,
        });
        return
      }

      res.status(200).json(transcation);
    } catch (err) {
      res.status(400).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

  async listTransactionBuyerOnSeller(req, res) {
    try {
      const {
        buyerId,
        sellerId
      } = req.params

      if (buyerId.toString() === sellerId.toString()) {
        res.status(400).json({
          status: "FAIL",
          message: "Request Cannot be Established."
        });
        return
      }

      if (req.user.id.toString() !== sellerId.toString()) {
        res.status(401).json({
          status: "FAIL",
          message: "Unauthorized."
        });
        return
      }

      var getProductsByBuyer = await transactionServices.listByCondition({
        where: {
          buyerId: buyerId
        },
        attributes: {
          exclude: ["createdAt","updatedAt"]
        },
        include: [
          {
            model: Products,
            as: "product",
            where: {
              sellerId: sellerId
            },
            attributes: {
              exclude: ["createdAt","updatedAt"]
            },
          },
          {
            model: Users,
            as: "buyer",
            attributes: ["name"],
            include: {
              model: Cities, 
              as: "city",
              attributes: ["name"]
            }
          }
        ]
      })

      res.status(200).json(getProductsByBuyer);
    } catch (err) {
      res.status(400).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

  async getAllNotificationUser(req, res) {
    try {
      var result = []
      const getProduct = await productServices.listByCondition({
        where: {
          sellerId: req.params.id,
        }
      })

      const getProductSeller = getProduct.map((product) => {
        return product.id;
      })

      const getTransactionSeller = await transactionServices.listByCondition({
        where: {
          productId: {
            [Op.or]: getProductSeller
          }
        },
        include: {
          model: Products,
        }
      })

      const getTransactionBuyer = await transactionServices.listByCondition({
        where: {
          buyerId: req.params.id,
          accBySeller: {
            [Op.or]: [true, false]
          }
        },
        include: {
          model: Products,
        }
      })

      results = [].concat(
        getProduct.map((product) => {
          return ({
            information: "Product of this user.",
            product
          })
        }),
        getTransactionSeller.map((ts) => {
          return ({
            information: "Product of this user that is bargained by someone else.",
            ts
          })
        }),
        getTransactionBuyer.map((tb) => {
          return ({
            information: "Product of this user that want to buy.",
            tb
          })
        })
      )

      const messages = results.map((result) => {
        var show;
        if (result.information === "Product of this user.") {
          show = result.product
          return ({
            msg: "Berhasil Diterbitkan",
            productId: show.id,
            image: show.images[0],
            name: show.name,
            price: application.priceFormat(show.price),
            time: application.timeFormat(show.createdAt),
            information: "Please GET /api/product/productId"
          })
        } else if (result.information === "Product of this user that is bargained by someone else.") {
          show = result.ts
          return ({
            msg: "Penawaran Produk",
            transactionId: show.id,
            image: show.Product.images[0],
            name: show.Product.name,
            price: application.priceFormat(show.Product.price),
            bargainPrice: application.priceFormat(show.bargainPrice),
            time: application.timeFormat(show.dateOfBargain),
            information: "Please GET /api/transaction/transactionId"
          })
        }
      })

      res.status(200).json({
        status: "success",
        data: messages
      })
    } catch (err) {
      res.status(400).json({
        status: "FAIL",
        message: err.message
      })
    }
  },
};