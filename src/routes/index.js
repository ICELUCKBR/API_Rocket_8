const { Router } = require("express");

const userRouter = require("./user.routes");
const movieRouter = require("./movies.routes");

const routes = Router();

routes.use("/users", userRouter);
routes.use("/movies", movieRouter);

module.exports = routes;
