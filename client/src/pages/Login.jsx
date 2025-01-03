import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


export const Login = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const changeHandler = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const loginHandler = async () => {
        try {
            const res = await axios.post("http://localhost:8000/api/v1/user/login", user, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/home");
            }
        } catch (e) {
            toast.error(e.response?.data?.message || "Login failed. Please try again.");
        }
    };
    const registerHandler = () => {
        navigate("/register");
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form className="space-y-4">
                    <Input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={changeHandler}
                        placeholder="Enter Your Email"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={changeHandler}
                        placeholder="Enter Your Password"
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                        onClick={loginHandler}
                        type="button"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Login
                    </Button>

                </form>
                <Button
                    onClick={registerHandler}
                    type="button"
                    className="w-full mt-4 bg-white-600 text-white py-2 px-4 rounded-md hover:bg-white-400"
                >
                    Register
                </Button>
                <ToastContainer position="top-right" autoClose={2000} />
            </div>
        </div>
    );
};

