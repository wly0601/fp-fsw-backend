const express = require("express");
const controllers = require("./controllers");
const middlewares = require("./middlewares");
const uploadOnMemory = require("../config/uploadOnMemory");
const apiRouter = express.Router();

// configure and initialization swagger
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../config/swagger.json');


apiRouter.get("/", controllers.api.application.getRoot);


/**
 * Authentication Resources 
 */
apiRouter.post("/api/login",
  controllers.api.authentication.login
);

apiRouter.post("/api/register",
  middlewares.checkCondition.checkCondition,
  controllers.api.authentication.register
);

apiRouter.get("/api/who-am-i",
  middlewares.authorization.authorize,
  controllers.api.authentication.whoAmI,
);

apiRouter.get("/api/user/:id",
  controllers.api.authentication.getUser,
);

apiRouter.get("/api/users",
  middlewares.authorization.authorize,
  controllers.api.authentication.getAllUsers,
);

apiRouter.put("/api/users/:id/detail",
  middlewares.authorization.authorize,
  controllers.api.authentication.updateDetail,
);


/**
 * Product Resources
 */

apiRouter.post("/api/products",
  middlewares.authorization.authorize,
  controllers.api.product.createProduct,
);

apiRouter.put("/api/product/:id",
  middlewares.authorization.authorize,
  controllers.api.product.updateProduct,
);

apiRouter.get("/api/product/:id",
  controllers.api.product.getProduct,
);

apiRouter.get("/api/user/:id/products",
  middlewares.authorization.authorize,
  controllers.api.product.listSellerProduct,
);

apiRouter.get("/api/products",
  controllers.api.product.getAllProducts,
);

apiRouter.delete("/api/product/:id",
  middlewares.authorization.authorize,
  controllers.api.product.deleteProduct,
);

/**
 * Transaction History
 */
apiRouter.post("/api/transaction",
  middlewares.authorization.authorize,
  controllers.api.transaction.createTransaction,
);

apiRouter.get("/api/transaction/:id",
  middlewares.authorization.authorize,
  controllers.api.transaction.getTransactionById,
);

apiRouter.put("/api/transaction/:id",
  middlewares.authorization.authorize,
  controllers.api.transaction.updateTransaction,
);

apiRouter.put("/api/transaction/:id/confirmation",
  middlewares.authorization.authorize,
  controllers.api.transaction.confirmationSeller,
);

apiRouter.get("/api/buyer/:buyerId/transaction",
  middlewares.authorization.authorize,
  controllers.api.transaction.listTransactionBuyerOnSeller,
);

apiRouter.get("/api/user/buyer/history-as-buyer",
  middlewares.authorization.authorize,
  controllers.api.transaction.historyAsBuyer,
);

/**
 * Notofication Resources
 */

apiRouter.get("/api/user/:id/notifications",
  middlewares.authorization.authorize,
  controllers.api.notification.getAllNotificationUser,
);

/**
 * City Resources
 */

apiRouter.get("/api/city/:id",
  middlewares.authorization.authorize,
  controllers.api.cities.getCity,
);

apiRouter.get("/api/cities",
  middlewares.authorization.authorize,
  controllers.api.cities.getAllCities,
);

/**
 * Category Resources
 */

apiRouter.get("/api/category/:id",
  controllers.api.category.getCategory,
);

apiRouter.get("/api/categories",
  controllers.api.category.getAllCategories,
);

/**
 * Upload Resources
 */
apiRouter.put(
  "/api/user/picture/:id/cloudinary",
  middlewares.authorization.authorize,
  uploadOnMemory.single("picture"),
  controllers.api.upload.uploadPhoto,
);

apiRouter.put(
  "/api/product/picture/:id/cloudinary",
  middlewares.authorization.authorize,
  uploadOnMemory.single("picture"),
  controllers.api.upload.uploadProductImages,
);

/**
 * API Documentation
 */

apiRouter.get('/documentation.json', (req, res) => res.send(swaggerDocument));
apiRouter.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

module.exports = apiRouter;