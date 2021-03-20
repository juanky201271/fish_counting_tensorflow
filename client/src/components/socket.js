import openSocket from 'socket.io-client';

const socket = openSocket(process.env.PUBLIC_URL);

export default socket;
