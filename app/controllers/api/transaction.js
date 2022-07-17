const transactionServices = require("../../services/transaction");
const productServices = require("../../services/product");
const {
  priceFormat,
  timeFormat
} = require("../../utils");
const userServices = require("../../services/users");

const {
  Products,
  Cities
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

      if (req.user.id === product.sellerId) {
        res.status(401).json({
          status: "FAIL",
          message: "Cannot bargain your own product!"
        });
        return;
      }

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

      res.status(200).json(transaction);
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
      } = req.params

      const getBuyerData = await userServices.getOne({
        where: {
          id: buyerId,
        },
        attributes: {
          exclude: ["encryptedPassword"]
        },
        include: {
          model: Cities,
          as: "city",
          attributes: ["name"]
        }
      })

      const getProductsByBuyer = await transactionServices.listByCondition({
        where: {
          buyerId: buyerId
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        },
        include: [{
          model: Products,
          as: "product",
          where: {
            sellerId: req.user.id
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          },
        }]
      })

      res.status(200).json({
        buyer: getBuyerData,
        order: getProductsByBuyer
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

  async historyAsBuyer(req, res) {
    try {
      const historyBuyer = await transactionServices.listByCondition({
        where: {
          buyerId: req.user.id,
        },
        include: {
          model: Products,
          as: 'product',
        },
        order: [
          ["id", "DESC"]
        ]
      });


      const result = historyBuyer.map((transaction) => {
        const tp = transaction.product;

        if (transaction.isCanceled === true) {
          return ({
            msg: "Transaksi Dibatalkan Penjual",
            name: tp.name,
            productId: tp.id,
            image: tp.images[0],
            price: priceFormat(tp.price),
            bargainPrice: `Ditawar ${priceFormat(transaction.bargainPrice)}`,
            time: timeFormat(transaction.dateOfBargain),
          })
        }

        if (transaction.accBySeller === true) {
          return ({
            msg: "Penawaran Produk",
            name: tp.name,
            productId: tp.id,
            image: tp.images[0],
            price: priceFormat(tp.price),
            bargainPrice: `Berhasil ditawar ${priceFormat(transaction.bargainPrice)}`,
            time: timeFormat(transaction.dateOfAccOrNot),
          })
        } else if (transaction.accBySeller === false) {
          return ({
            msg: "Penawaran Produk",
            name: tp.name,
            productId: tp.id,
            image: tp.images[0],
            price: priceFormat(tp.price),
            bargainPrice: `Gagal ditawar ${priceFormat(transaction.bargainPrice)}`,
            time: timeFormat(transaction.dateOfAccOrNot),
          })
        } else {
          return ({
            msg: "Penawaran Produk",
            name: tp.name,
            productId: tp.id,
            image: tp.images[0],
            price: priceFormat(tp.price),
            bargainPrice: `Ditawar ${priceFormat(transaction.bargainPrice)}`,
            time: timeFormat(transaction.dateOfBargain),
          })
        }
      });

      res.status(200).json({
        message: "Success",
        result,
      });
    } catch (err) {
      res.status(422).json({
        error: {
          name: err.name,
          message: err.message,
        }
      })
    }
  },

  async updateTransaction(req, res) {
    try {
      const {
        accBySeller
      } = req.body
      const dateOfAccOrNot = new Date()

      const getTransactionId = await transactionServices.getOne({
        where: {
          id: req.params.id,
        },
        include: {
          model: Products,
          as: "product"
        }
      })

      if (getTransactionId.product.sellerId.toString() !== req.user.id.toString()) {
        res.status(401).json({
          status: "Unauthorized",
          message: "Can't see other people transaction"
        });
        return;
      };

      const transaction = await transactionServices.get(req.params.id)
      await transactionServices.update(req.params.id, {
        accBySeller,
        dateOfAccOrNot,
      });

      if (!accBySeller) {
        await productServices.update(transaction.productId, {
          statusId: 1,
        })
      }

      res.status(201).json({
        status: "Success",
        message: `Transaction with id ${req.params.id} has been updated.`,
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

  async confirmationSeller(req, res) {
    try {
      const {
        isCanceled
      } = req.body

      const getTransactionId = await transactionServices.getOne({
        where: {
          id: req.params.id,
        },
        include: {
          model: Products,
          as: "product"
        }
      })

      if (getTransactionId.product.sellerId.toString() !== req.user.id.toString()) {
        res.status(401).json({
          status: "Unauthorized",
          message: "Can't see other people transaction"
        });
        return;
      };

      const transaction = await transactionServices.get(req.params.id)
      await transactionServices.update(req.params.id, {
        isCanceled,
      });

      if (!isCanceled) {
        await productServices.update(transaction.productId, {
          statusId: 3,
        })
      } else {
        await productServices.update(transaction.productId, {
          statusId: 1,
        })
      }

      res.status(201).json({
        status: "Success",
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
};