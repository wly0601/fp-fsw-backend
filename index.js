require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./app/router");
const { MORGAN_FORMAT } = require("./config/application");
const app = express();
console.clear();

const nodeEnv = process.env.NODE_ENV;
if (!nodeEnv || nodeEnv !== "production") {
  app.use(morgan(MORGAN_FORMAT));
}

app.use(cors());
app.use(express.json());
app.use(router);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    console.log(`Server on at ${Date(Date.now)}`);
})

module.exports = app;