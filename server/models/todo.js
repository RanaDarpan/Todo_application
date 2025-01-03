import mongoose from "mongoose";


const TodoSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },description:{
        type:String,
        required:true
    },
    priority: { type: String,
        enum: ["urgent", "optional"],
        default: "optional" },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
})

export const Todo = mongoose.model('Todo',TodoSchema);