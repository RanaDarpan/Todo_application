import { CreateTodo, getAllTodos, updateTodo, deleteTodo } from "../controller/todo.js";
import express from "express";
import bodyParaser from "body-parser";
import isAuthenticate from "../middleware/isAuthenticate.js";
import cookieParser from "cookie-parser";
const router = express.Router();

router.use(bodyParaser.urlencoded({ extended: true }))
router.use(express.json());

router.route("/").post(CreateTodo).get(getAllTodos);
// router.route("/").get(getAllTodos)
router.route("/:todoID").put(isAuthenticate,updateTodo).delete(isAuthenticate,deleteTodo);;
// router.route("/:todoID").delete(deleteTodo);
export default router;
