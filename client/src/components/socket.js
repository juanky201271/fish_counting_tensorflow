// juanky201271 - AIPeces - 2021

import openSocket from 'socket.io-client';

const socket = openSocket(process.env.REACT_APP_PUBLIC_URL);

export default socket;
