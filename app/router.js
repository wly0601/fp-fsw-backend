const express = require("express");
const controllers = require("./controllers");

const apiRouter = express.Router();

/**
 * Authentication Resource
 * */
// apiRouter.post("/api/login", controllers.api.authentication.login);
apiRouter.post("/api/register", controllers.api.authentication.register);

module.exports = apiRouter;
