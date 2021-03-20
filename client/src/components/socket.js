import openSocket from 'socket.io-client';

const socket = openSocket(process.env.REACT_APP_PUBLIC_URL);

export default socket;
