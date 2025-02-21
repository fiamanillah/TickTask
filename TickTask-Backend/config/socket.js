const { Server } = require('socket.io');

const allowedOrigins = [
    'https://parcelpop-project.web.app', // Production frontend
    'http://localhost:5173', // Development frontend
];

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        },
    });

    io.on('connection', socket => {
        console.log('Client Connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client Disconnected:', socket.id);
        });

        // Example: Custom event listener
        socket.on('message', data => {
            console.log('Received message:', data);
            io.emit('message', data); // Broadcast to all clients
        });
    });

    return io;
}

module.exports = initializeSocket;
