import { useState, useEffect } from 'react'; // ✅ Add missing imports
import axios from 'axios'; // ✅ Import axios
import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import { ToastContainer } from 'react-toastify';
import socket from './socket.jsx';

const App = () => {
  const [Login, setLogin] = useState(localStorage.getItem("islogin"));

  const setLoginFunc = (value) => {
    setLogin(value);
  };

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!Login) return;
      
      try {
        // Use any protected endpoint that you already have
        const response = await axios.get("/api/conversation/get-conversation", { 
          withCredentials: true // ✅ Correct syntax (remove quotes)
        });
        
        // If success, token is valid
        console.log("Token is valid");
        
      } catch (err) {
        // ✅ Check for 401 (Unauthorized) not 500 (Server Error)
        if (err.response?.status === 401 || err.response?.status === 400) {
          // Token expired
          console.log("Token expired, logging out...");
          localStorage.removeItem("islogin");
          localStorage.removeItem("userInfo");
          setLogin(false);
          window.location.href = '/';
        } else if (err.response?.status === 500) {
          // Server error - don't logout user for server issues
          console.log("Server error, but token might still be valid");
        } else {
          // Network error or other issues
          console.log("Network error or other issue");
        }
      }
    };

     checkTokenValidity();
     const interval = setInterval(checkTokenValidity, 60 * 1000);

     return () => clearInterval(interval); // ← This stops the 1-minute checks when user leaves dashboard  //else u said it is a cleanup funtion in useeffect it only run when the compoenent unmonted 

  }, [Login]);

  return (
    <div className='App'>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={Login ? <Navigate to={'/dashboard'} /> : <Home setLoginFunc={setLoginFunc} />} />
          <Route path='/dashboard' element={Login ? <Dashboard setLoginFunc={setLoginFunc} /> : <Navigate to={'/'}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;