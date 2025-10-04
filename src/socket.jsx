import {io} from 'socket.io-client';

const socket = io('https://chat-app-server-ulsb.onrender.com', {
  transports: ['polling']
})

export default socket;
