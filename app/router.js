const express = require("express");
const controllers = require("./controllers");
const middlewares = require("./middlewares");

const apiRouter = express.Router();

/**
 * Authentication Resource
 * */
// apiRouter.post("/api/login", controllers.api.authentication.login);
apiRouter.post("/api/register",
    middlewares.checkCondition.checkCondition, 
    controllers.api.authentication.register
);

module.exports = apiRouter;
