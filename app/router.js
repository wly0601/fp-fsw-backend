const express = require("express");
const controllers = require("./controllers");
const middlewares = require("./middlewares");

const apiRouter = express.Router();

/**
 * Authentication Resource 
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

apiRouter.get("/api/users/:id",
	controllers.api.authentication.authorize, 
	controllers.api.authentication.getUser,	
)


module.exports = apiRouter;
