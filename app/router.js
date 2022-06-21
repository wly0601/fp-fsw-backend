const express = require("express");
const controllers = require("./controllers");
const middlewares = require("./middlewares");

const apiRouter = express.Router();

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
	controllers.api.authentication.authorize,
	controllers.api.authentication.whoAmI,	
)

apiRouter.get("/api/users",
	controllers.api.authentication.authorize, 
	controllers.api.authentication.getAllUsers,	
)

apiRouter.put("/api/users/:id/detail",
	controllers.api.authentication.authorize, 
	controllers.api.authentication.updateDetail,	
)


/**
 * Product Resources
 */

apiRouter.post("/api/products",
	controllers.api.authentication.authorize, 
	controllers.api.product.createProduct,
)

apiRouter.put("/api/product/:id",
	controllers.api.authentication.authorize, 
	controllers.api.product.updateProduct,
)

apiRouter.delete("/api/product/:id",
	controllers.api.authentication.authorize, 
	controllers.api.product.deleteProduct,
)



module.exports = apiRouter;
