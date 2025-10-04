import React, { useState ,useEffect} from 'react'
import './Login.css'
import axios from "axios"
import Loader from './loader/loader.jsx'
import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify'; // ✅ Correct imports



const Login = ({funcSetLogin,setLoginFunc}) => {


  const [Loading, setLoading] = useState(false)
  const [inputfield, setinputfield] = useState({ mobilenumber: "", password: "" })
  const [shouldNavigate, setShouldNavigate] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    if (shouldNavigate) {
      navigate('/dashboard')
      setShouldNavigate(false)
    }
  }, [shouldNavigate, navigate])


  const handleClickNotRegister = () => {
    funcSetLogin(false)
  }

  const handleonchnage = (event, key) => {

    setinputfield((prev) => ({
      ...prev, [key]: event.target.value
    }))

  }

  const handleLogin = async () => {

    try {

      setLoading(true);
    
      const response = await axios.post("/api/auth/login", inputfield, {
        withCredentials: true   //to accept the cookie from the server auto set in brower cokkie
      })

      // const token = response.data.token;
      // const decoded = jwtDecode(token);
      // console.log(decoded);

      let userInfo = response.data.user
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      localStorage.setItem("islogin", true)
      setLoginFunc(true)     //this true the value islogin and we will then always go to the home page if login true 
      setShouldNavigate(true)
      toast.success(response.data.message);

    } catch (err) {

      let error = err.response.data.message;
      toast.error(error)

    } finally {
      setLoading(false);
    }

  }

  return (


    <div className='login'>

      {Loading && <Loader />}
      
      <div className='Register-card'>

        <div className='card-name'>
          Login
        </div>

        <div className='Login-form'>

          <input value={inputfield.mobilenumber} onChange={(event) => handleonchnage(event, "mobilenumber")} type="text" className='inputbox' placeholder='Enter Number' />
          <input value={inputfield.password} onChange={(event) => handleonchnage(event, "password")} type="password" className='inputbox' placeholder='Enter Password' />
          <div onClick={handleLogin} className='button'>Login</div>
          <div className='LinkedLinks' onClick={handleClickNotRegister}>Not Register Yet</div>

        </div>

      </div>

    </div>

  )
}

export default Login
