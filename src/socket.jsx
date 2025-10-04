import {io} from 'socket.io-client';

const socket = io('https://hope-by-aziz-serverapp.onrender.com', {
  transports: ['websocket']
})

export default socket;
