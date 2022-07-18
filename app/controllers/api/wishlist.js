const wishServices = require("../../services/wishlist");
const productServices = require("../../services/product");
const { Categories, Products } = require("../../models");

module.exports = {
  async createOrDeleteWishlist(req, res) {
    try {
      const { productId, activeBtn } = req.body;
      const product = await productServices.get(productId);

      if (req.user.id === product.sellerId) {
        res.status(401).json({
          status: "FAIL",
          message: "Cannot wishlist your own product!"
        });
        return;
      }

      if(!activeBtn) {
        const [wish, created] = await wishServices.findOrCreate({
          where : {
            buyerId: req.user.id,
            productId,
          }
        });
        
        if(created) {
          const product = await productServices.get(productId);
  
          await productServices.update(productId, {
            numberOfWishlist: product.numberOfWishlist + 1,
          });

          res.status(201).json({
            status: "Success",
            message: `Product with id ${productId} was marked.`
          });
          return;
        } else {
          res.status(409).json({
            status: "Conflict",
            message: `Product with id ${productId} already marked.`
          });
          return;
        }
      } else {
        const userProduct = await wishServices.getOne({
          where: {
            buyerId: req.user.id,
            productId,
          }
        });
  
        if (!userProduct) {
          res.status(404).json({
            status: "FAIL",
            message: `Wishlist not found!`,
          });
          return;
        }
  
        await wishServices.delete(userProduct.buyerId);
        res.status(200).json({
          status: "OK",
          message: `Wishlist has been deleted.`,
        });
        return;
      }
    } catch (err) {
      res.status(400).json({
        error: {
          name: err.name,
          message: err.message,
        }
      });
    }
  },

  async listWishlists(req, res) {
    try {
      const products = await wishServices.listByCondition({
        where: {
          buyerId: req.user.id,
        },
        include: {
          model: Products,
          as: "product",
          attributes: ["id", "name", "price", "images"],
          include: {
            model: Categories,
            as: "category"
          }
        },
      });

      res.status(200).json({
        status: "Success!",
        products
      });
    } catch (err) {
      res.status(400).json({
        error:{
          name: err.name,
          message: err.message
        }
      });
    }
  },
};