import {io} from 'socket.io-client';

const socket = io('https://hope-by-aziz-serverapp.onrender.com', {
  transports: ['polling']
})

export default socket;
