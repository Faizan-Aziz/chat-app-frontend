import {useEffect,useState} from 'react'
import './conversation.css'

const Conversation = (props) => {    // ← Outer function (component)

  const [FriendItem, setFriendItem] = useState([])

  useEffect(() => {
  let ownID=JSON.parse(localStorage.getItem("userInfo"))._id;
  let friendItem= props.members.filter((item)=>item._id!==ownID)
  setFriendItem(friendItem)
  console.log(friendItem);
  
  }, [props.members])


  const handleOnclick=()=>{
    props.handleSelectedUser(props.id ,FriendItem)

  // This inner function accesses props.id and FriendItem
  // from the outer function = CLOSURE!

  }


  return (
    <>
     {/* particular conversation block */}
                    <div className={`conv ${props.active?`active-class`:null}`} onClick={handleOnclick}>

                    <div className='conv-profile-img'>
                      <img className='profile-img-conv'  src={FriendItem[0]?.profile ||"https://imresizer.com/_next/image?url=%2Fimages%2Fsample-photo-1.jpg&w=3840&q=75" }/>
                    </div>

                    <div className='conv-name'>

                        <div className='conv-profile-name'>{FriendItem[0]?.name}</div>
                        <div className='conv-last-message'>{FriendItem[0]?.mobilenumber}</div>

                    </div>
                    </div>
    </>               

  )
}

export default Conversation