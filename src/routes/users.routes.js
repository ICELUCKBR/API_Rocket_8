const { Router } = require("express");


const UserController = require("../controllers/UsersController")
const usersRoutes = Router();


function myMiddleware(request,response,next){
console.log("você passou pelo middleware")
if(!request.body.isAdmin){
    return response.json({message:"User unathorized"})
}
next();
}
const userController = new UserController()

usersRoutes.post("/", userController.create);
usersRoutes.put("/:id",userController.update)

module.exports = usersRoutes;
