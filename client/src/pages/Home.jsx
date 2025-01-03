import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Navbar } from './Navbar';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export const Home = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const [priority, setPriority] = useState("optional");

  const addTodoHandler = async () => {
    try {
      const res = await axios.post(
        'https://todo-application-1orh.onrender.com/api/v1/todo',
        { title, description, priority },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        }
      );
      if (res.data.success) {
        toast.success(res.data.message, { autoClose: 1500 });
        setDescription('');
        setTitle('');
        fetchTodos(); 
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add todo.', { autoClose: 3000 });
    }
  };



  const fetchTodos = async () => {
    try {
      const res = await axios.get('https://todo-application-1orh.onrender.com/api/v1/todo', {
        withCredentials: true,
      });
      if (res.data.success) {
        setTodos(res.data.todos);
        checkTaskExpiration(res.data.todos);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkTaskExpiration = (todos) => {
    const currentTime = new Date().getTime();
    todos.forEach((todo) => {
      const createdAt = new Date(todo.createdAt).getTime();
      // const expirationTime = createdAt + 2 * 60 * 60 * 1000; // 24 hours later
      const expirationTime = createdAt + 3 * 60 * 1000;
      const timeRemaining = expirationTime - currentTime;

      // Check if the task is urgent and if it's within 2 hours of expiration
      if (todo.priority === 'urgent' && timeRemaining <= 2 * 60 * 1000 && timeRemaining > 0) {
        toast.info('Reminder: Your urgent task will expire in 2 hours!', { autoClose: 10000 });
      }

      // If task is expired, delete it
      if (timeRemaining <= 0) {
        deleteTodoHandler(todo._id);
      }
    });
  };



  const deleteTodoHandler = async (todoID) => {
    try {
      const res = await axios.delete(
        `https://todo-application-1orh.onrender.com/api/v1/todo/${todoID}`,
        { credentials: "include" }
      );
      if (res.data.success) {
        toast.success(res.data.message, { autoClose: 2000 });
        fetchTodos(); 
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete todo.', { autoClose: 3000 });
    }
  };

  const updateTodoHandler = async () => {
    try {
      const res = await axios.put(
        `https://todo-application-1orh.onrender.com/api/v1/todo/${editTodo._id}`,
        { title: editTodo.title, description: editTodo.description, priority: editTodo.priority },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        }
      );
      if (res.data.success) {
        toast(res.data.message, { autoClose: 2000 });
        setEditTodo(null);
        fetchTodos(); 
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update todo.', { autoClose: 3000 });
    }
  };

  useEffect(() => {
    fetchTodos();
    const interval = setInterval(() => {
      fetchTodos(); // Recheck todos every 10 minutes
    }, 60000); // 10 minutes

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter new Task ..."
            className="flex-1"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write Description"
            className="flex-1"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded px-2 py-1 bg-gray-50"
          >
            <option value="optional">Optional</option>
            <option value="urgent">Urgent</option>
          </select>

          <Button onClick={addTodoHandler} className="bg-blue-600 text-white">
            Add Todo
          </Button>

        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {todos.map((todo) => (
            <Card key={todo._id} className="shadow-lg border rounded-md p-4">
              <CardHeader>
                {editTodo && editTodo._id === todo._id ? (
                  <>
                    <Input
                      value={editTodo.title}
                      onChange={(e) =>
                        setEditTodo((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      type="text"
                      placeholder="Edit Task Title"
                      className="mb-2"
                    />
                    <Textarea
                      value={editTodo.description}
                      onChange={(e) =>
                        setEditTodo((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Edit Task Description"
                    />
                    <select
                      value={editTodo.priority}
                      onChange={(e) =>
                        setEditTodo((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                      className="border bg-gray-50 rounded px-2 py-1"
                    >
                      <option value="optional">Optional</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </>
                ) : (
                  <>
                    <CardTitle className="text-lg font-bold text-gray-700">
                      {todo.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {todo.description}
                    </CardDescription>
                    <p className={`text-sm ${todo.priority === 'urgent' ? 'text-red-600' : 'text-green-600'}`}>
                      {todo.priority.toUpperCase()}
                    </p>
                  </>
                )}
              </CardHeader>

              <CardFooter className="flex justify-between">
                {editTodo && editTodo._id === todo._id ? (
                  <Button
                    onClick={updateTodoHandler}
                    className="bg-green-500 text-white"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => setEditTodo(todo)}
                    className="bg-gray-500 text-white"
                  >
                    Edit
                  </Button>
                )}


                <Button
                  variant="outline"
                  className="text-red-700 border border-red-700"
                  onClick={() => deleteTodoHandler(todo._id)}
                >
                  Delete
                </Button>


              </CardFooter>
            </Card>
          ))}

        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};


