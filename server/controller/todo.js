
import { Todo } from "../models/todo.js";



export const CreateTodo = async (req, res) => {
    try {
      const { title, description, priority = "optional" } = req.body;
  
      if (!title || !description) {
        return res.status(403).json({
          success: false,
          message: "All fields are required",
        });
      }
  
      const todo = new Todo({ title, description, priority });
      await todo.save();
  
      return res.status(201).json({
        success: true,
        message: "Todo created!",
        todo,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  



export const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        console.log(todos);

        return res.status(200).json({
            success: true,
            todos
        })
    } catch (e) {
        console.log(e);
    }
}




export const updateTodo = async (req, res) => {
    try {
      const todoID = req.params.todoID;
      const { title, description, priority } = req.body;
  
      const todo = await Todo.findByIdAndUpdate(
        todoID,
        { title, description, priority },
        { new: true }
      );
  
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        todo,
        message: "Todo updated!",
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  



export const deleteTodo = async (req, res) => {
    try {
        const todoID = req.params.todoID;
        const todo = await Todo.findByIdAndDelete(todoID);

        //   await todo.save()
        return res.status(200).json({
            success: true,
            message: "Todo Deleted !!"
        })
    } catch (e) {
        console.log(e)
    }
}
