import React  , {useState} from 'react'
import './Home.css'
import Login from './Login'
import Register from './Register'

const Home = (props) =>  {

  const [Loginpage, setLoginPage] = useState(true)   //Now see how can u changed the state from the parent to the child

  const funcSetLogin = (val) =>{
    return setLoginPage(val)
  }
  
  return (
    <div className='home'>

       {
        Loginpage?<Login setLoginFunc={props.setLoginFunc} funcSetLogin={funcSetLogin}/>:<Register funcSetLogin={funcSetLogin}/> 
       }  

    </div>

  )
}

export default Home