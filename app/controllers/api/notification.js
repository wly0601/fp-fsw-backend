const transactionServices = require("../../services/transaction");
const productServices = require("../../services/product");
const { priceFormat, timeFormat, sortTimeDecendingly } = require("../../utils");
const { Op } = require("sequelize");
const { Products } = require("../../models");

module.exports = {
  async getAllNotificationUser(req, res) {
    try {
      const getProduct = await productServices.listByCondition({
        where: {
          sellerId: req.user.id,
        }
      });

      const getProductSeller = getProduct.map((product) => {
        return product.id;
      });

      var getTransactionSeller = [];

      if(getProductSeller.length !== 0){
        getTransactionSeller = await transactionServices.listByCondition({
          where: {
            productId: {
              [Op.or]: getProductSeller
            }
          },
          include: {
            model: Products,
            as: "product"
          }
        });
      }

      const getTransactionBuyer = await transactionServices.listByCondition({
        where: {
          buyerId: req.user.id,
          accBySeller: {
            [Op.or]: [true, false]
          }
        },
        include: {
          model: Products,
          as: "product"
        }
      });

      const results = [].concat(
        getProduct.map((product) => {
          return ({
            information: "Product of this user.",
            product
          });
        }),
        getTransactionSeller.map((ts) => {
          return ({
            information: "Product of this user that is bargained by someone else.",
            ts
          });
        }),
        getTransactionBuyer.map((tb) => {
          return ({
            information: "Product of this user that want to buy.",
            tb
          });
        })
      );

      var messages = results.map((result) => {
        var show;
        if (result.information === "Product of this user.") {
          show = result.product;

          return ({
            msg: "Berhasil Diterbitkan",
            productId: show.id,
            image: show.images[0],
            name: show.name,
            price: priceFormat(show.price),
            time: timeFormat(show.createdAt),
            realTimeFormat: show.createdAt,
            information: "Please Change to edit product page and GET /api/product/productId"
          });
        } else if (result.information === "Product of this user that is bargained by someone else.") {
          show = result.ts;
          return ({
            msg: "Penawaran Produk",
            transactionId: show.id,
            image: show.product.images[0],
            name: show.product.name,
            buyerId: show.buyerId,
            price: priceFormat(show.product.price),
            bargainPrice: `Ditawar ${priceFormat(show.bargainPrice)}`,
            time: timeFormat(show.dateOfBargain),
            realTimeFormat: show.dateOfBargain,
            information: "Please go to offering page and GET /api/user/buyerId/transaction"
          });
        } else if (result.information === "Product of this user that want to buy." && result.tb.accBySeller === true) {
          show = result.tb;
          return ({
            msg: "Penawaran Produk",
            transactionId: show.id,
            image: show.product.images[0],
            name: show.product.name,
            buyerId: show.buyerId,
            price: priceFormat(show.product.price),
            bargainPrice: `Berhasil Ditawar ${priceFormat(show.bargainPrice)}`,
            time: timeFormat(show.dateOfAccOrNot),
            realTimeFormat: show.dateOfAccOrNot,
            anotherMsg: "Kamu akan dihubungi penjual via WhatsApp",
            moreDetail: "price awalnya dicoret"
          });
        } else if (result.information === "Product of this user that want to buy." && result.tb.accBySeller === false) {
          show = result.tb;
          return ({
            msg: "Penawaran Produk",
            transactionId: show.id,
            productId: show.productId,
            image: show.product.images[0],
            name: show.product.name,
            buyerId: show.buyerId,
            price: priceFormat(show.product.price),
            bargainPrice: `Gagal Ditawar ${priceFormat(show.bargainPrice)}`,
            time: timeFormat(show.dateOfAccOrNot),
            realTimeFormat: show.dateOfAccOrNot,
            detail: "Please go to product page and GET /api/product/productId"
          });
        }
      });

      const sortedMsg = sortTimeDecendingly(messages);
    
      res.status(200).json({
        status: "success",
        data: sortedMsg
      });
    } catch (err) {
      res.status(400).json({
        status: "FAIL",
        message: err.message
      });
    }
  },
};