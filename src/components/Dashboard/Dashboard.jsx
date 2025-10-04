import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import Conversation from '../Conversation/Conversation';
import Chat from '../Conversation/Chat/Chat';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCallback } from 'react';
import socket from '../../socket.jsx';

const Dashboard = (props) => {
  const [selectedUserDetails, setSlectedUserDetails] = useState(null)
  const [selectedID, setselectedID] = useState(null)
  const [queryparam, setQueryParam] = useState('')
  const [searchdata, setSearchData] = useState([])
  const [conversation, setConversation] = useState([])
  const ref = useRef();
  const navigate = useNavigate();

  const handleSelectedUser = (Id, userDetails) => {

      console.log("🟢 MOBILE - handleSelectedUser called with ID:", Id);
  console.log("🟢 MOBILE - Socket connected:", socket.connected);
  console.log("🟢 MOBILE - Socket ID:", socket.id);

    setSlectedUserDetails(userDetails)
    setselectedID(Id)
    console.log(selectedUserDetails);
   
    
    // ADD THIS: For mobile responsiveness - show chat full screen
    if (window.innerWidth <= 480) {
      document.querySelector('.dashboard-card').classList.add('chat-active');
    }
  };

  // ADD THIS NEW FUNCTION: Handle back to contacts on mobile
  const handleBackToContacts = () => {
    setSlectedUserDetails(null);
    setselectedID(null);
    document.querySelector('.dashboard-card').classList.remove('chat-active');
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setSearchData([]);
      setQueryParam('');
    }
  };

  let fetchconversational = useCallback(async () => {
    try {
      let response = await axios.get("/api/conversation/get-conversation", { withCredentials: "true" })
      setConversation(response.data.conversation)
      console.log(response.data.conversation);
    } catch (error) {
      console.log(error);
    }
  }, [])

  const fetchUserBysearch = async () => {
    try {
      let response = await axios.get(`/api/auth/serachedMember?queryParam=${queryparam}`, {
        withCredentials: true
      });
      console.log(response.data);
      setSearchData(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (queryparam.length !== 0) {
      fetchUserBysearch()
    }
  }, [queryparam])

  useEffect(() => {
    fetchconversational();
  }, []);

  useEffect(() => {
    if (searchdata.length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchdata]);

  useEffect(() => {
    // Join user to their personal room
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo._id) {
      socket.emit("joinUserRoom", userInfo._id);
    }

    // Listen for new conversation notifications
    socket.on("newConversationAdded", (conversationData) => {
      console.log("Someone added you to conversation:", conversationData);
      
      setConversation(prev => {
        const exists = prev.find(conv => conv._id === conversationData._id);
        if (!exists) {
          return [conversationData, ...prev];
        }
        return prev;
      });
    });

    return () => {
      socket.off("newConversationAdded");
    };
  }, []);

  const handlelogout = async () => {
    try {
      const response = await axios.post(('/api/auth/Logout'), {}, {
        withCredentials: true
      })
      console.log(response);
      localStorage.clear();
      props.setLoginFunc(false)
      navigate('/')
    } catch (error) {
      console.log(error);
    }
  }

  const handleCreateConv = async (id) => {
    try {
      let response = await axios.post(`/api/conversation/add-conversation`, { recieverID: id }, { withCredentials: true })
      
      console.log("NEW CONVERSATION DATA:", response.data.conversation);
      console.log("MEMBERS:", response.data.conversation.members);
      
      if(response.data.message === "Conversation already exists"){
        alert("This person is already Added you can start convo with him")
        return
      }

      socket.emit("conversationAdded", id, response.data.conversation);
      setConversation(prev => [response.data.conversation, ...prev]);
      setQueryParam("")
      setSearchData([]);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='dashboard'>
      <div className='dashboard-card'>
        <div className='dashboard-conversation'>
          <div className='dashboard-conv-block'>
            <div className='dashboard-title-block'>
              <div>Chats</div>
              <div onClick={handlelogout}><LogoutIcon sx={{ fontSize: "32px", cursor: 'pointer' }} /></div>
            </div>

            <div className='searchBoxDiv'>
              <input value={queryparam} onChange={(event) => { setQueryParam(event.target.value) }} type="text" placeholder='Search person to Text' className='searchBox' />
              <button type='submit' className='searchIcon'><SearchIcon /></button>

              {searchdata.length > 0 ? 
                <div ref={ref} className='searched-box'>
                  {searchdata.map((item, index) => {
                    return (
                      <div className='search-item' key={index} onClick={() => handleCreateConv(item._id)}>
                        <img className='search-item-profile' src={item.profilehttps || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRXnX2Ll2oJczcpV6ltFTSeGGQ_I_2kdCeSg&s'} />
                        <div>{item.name}</div>
                        <div className='search-item-mobile'>{item.mobilenumber}</div>
                      </div>
                    )
                  })}
                </div>
                : queryparam.length !== 0 && searchdata.length === 0 ?
                  <div ref={ref} className='searched-box'>
                    <div className='search-item'>
                      <img className='search-item-profile' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRXnX2Ll2oJczcpV6ltFTSeGGQ_I_2kdCeSg&s" alt="" />
                      <div>No Data Found</div>
                    </div>
                  </div>
                : null
              }
            </div>

            <div className='conv-block'>
              {conversation.map((item, index) => {
                return (
                  <Conversation 
                    active={item._id===selectedID} 
                    handleSelectedUser={handleSelectedUser}  
                    item={item} 
                    id={item._id} 
                    members={item.members} 
                    key={item._id} // ADD KEY PROP
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* FIXED: Only render Chat once with the onBack prop */}
        {selectedUserDetails ? 
          <Chat 
            selectedID={selectedID} 
            selectedUserDetails={selectedUserDetails} 
            onBack={handleBackToContacts}
          /> 
          : 
          <div className='nochatselected'>
            No Chat selected
          </div>
        }
      </div>
    </div>
  )
}

export default Dashboard