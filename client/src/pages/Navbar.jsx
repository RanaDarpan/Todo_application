import { Button } from '@/components/ui/button'
import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'

export const Navbar = () => {
  const navigate = useNavigate();
  const logoutHandler = async () => {

    try {
        const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });

      console.log(res);
      if (res.data.success) {
        alert(res.data.message);
        navigate("/");
      }

    } catch (e) {
      const errorMessage = e.response?.data?.message || "An unexpected error occurred. Please try again.";
      toast(errorMessage);
      // alert(e.response.data.message);
    }
  }
  return (
    <div className='bg-gray-600'>
      <div className='p-2 flex itmes-center justify-between'>
        <h1 className='font-bold text-xl text-white'>
          Rana's Todo
        </h1>
        <Button onClick={logoutHandler}>Logout</Button>
      </div>
      <ToastContainer />
    </div>
  )
}
