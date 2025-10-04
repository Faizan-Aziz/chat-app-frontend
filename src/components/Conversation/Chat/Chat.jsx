import React ,{useState ,useRef}from 'react'
import "./Chat.css"
import SendIcon from '@mui/icons-material/Send';
import { useEffect } from 'react';
import axios from 'axios';
import socket from '../../../socket';

const Chat = (props) => {
  const [content, setcontent] = useState("")
  const [chats, setchats] = useState([])
  const ownid=JSON.parse(localStorage.getItem("userInfo"))._id;
  const ref=useRef()
  
  // ADD STATE FOR WINDOW WIDTH
  const [isMobile, setIsMobile] = useState(false)


   useEffect(() => {
    if (props.selectedID) {
      console.log("Mobile joining room:", props.selectedID);
      socket.emit("joinConversation", props.selectedID);
    }
  }, [props.selectedID]);
  

  useEffect(() => {
    // Check if mobile on component mount and on resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const fetchMessages= async()=>{
    try {
      const response=await axios.get(`/api/chat/get-message-chat/${props.selectedID}` , {withCredentials:true})
      console.log(response.data.message);
      setchats(response.data.message);
    } catch (error) {
      console.log(error);    
    }
  }

 useEffect(() => {
  const handler = (response) => {
    setchats((prev) => [...prev, response]); // functional update ✅
  };
  socket.on("receiveMessage", handler);

  return () => {
    socket.off("receiveMessage", handler); // cleanup ✅
  };
}, []);


 // Scroll to the bottom whenever chats change
useEffect(() => {
  if (ref.current) {
    // Short timeout so mobile browsers finish layout after keyboard shifts
    const t = setTimeout(() => {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 150);
    return () => clearTimeout(t);
  }
}, [chats]);



  const handleSendMessage = async()=>{
    try {
      if(content.trim().length===0) return alert("please enter the messgae")

      const response=await axios.post(`/api/chat/post-message-chat`,{
        conversation:props.selectedID,
        content:content
      },  {withCredentials:true})

      socket.emit("sendMessage",props.selectedID , response.data )
      console.log(response);
      setcontent("")
    } catch (error) {
      console.log(error);    
    }
  }

  useEffect(() => {
    fetchMessages()
    setcontent("")
  },[props.selectedID])

  return (
    <div className='dashboard-chats'>
      <div className='chatNameBlock'>
        {/* FIXED: Use state instead of direct window check */}
        {isMobile && (
          <div 
            className='back-button' 
            onClick={props.onBack}
            style={{
              marginRight: '10px',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '5px'
            }}
          >
            ←
          </div>
        )}

        <div className='chat-profile-img'>
          <img className='profile-img-conv' src={ props?.selectedUserDetails[0]?.profile || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRXnX2Ll2oJczcpV6ltFTSeGGQ_I_2kdCeSg&s' }  />
        </div>

        <div className='chat-name'>
          {props?.selectedUserDetails[0]?.name}
        </div>
      </div> 


      <div className='chats-Block'>
        {chats.map((item, index) => (
          <div key={index} className={`chat ${ownid === item?.sender?._id ? 'message-me' : null}`}>
            <div className='chat-send-rev-image'>
              <img className='profile-img-conv'
                src={item?.sender?.profile || 'https://...'} />
            </div>
            <div className='message'>
              {item.message}
            </div>
          </div>
        ))}

        <div ref={ref}></div>

      </div>


      <div className='message-box'>
        <div className='message-input-box'>
          <input value={content} onChange={event=>{setcontent(event.target.value)}} placeholder='type your message here' className='searchBox  messageBox' />
        </div>
        <div onClick={handleSendMessage}>
          <SendIcon  sx={{ fontSize: "32px" , margin : "10px" , cursor: "pointer"}}/>
        </div>
      </div>
    </div>
  )
}

export default Chat
