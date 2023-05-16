const { Router } = require("express")

const  MoviesController = require("../controllers/MoviesController")
const movieRoutes = Router();

const moviesController = new MoviesController()

movieRoutes.post("/",moviesController.create);


module.exports = movieRoutes
