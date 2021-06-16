// juanky201271 - AIPeces - 2021

import openSocket from 'socket.io-client';

const socketPy = openSocket(process.env.REACT_APP_PUBLIC_URL_PY);

export default socketPy;
