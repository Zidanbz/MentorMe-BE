const {Server} = require("socket.io");

let io;
const activeUser = new Map();

const initializeSocket = server => {
    console.log("Initializing Socket");
    io = new Server( server, {
        cors: {
            // origin: "http://localhost:3000",
            origin: "http://127.0.0.1:5001/mentorme-aaa37/us-central1/widgets",
            // origin: "*",
            method: ["GET", "POST"],
        },
    });

    io.on("connection", socket => {
        connectionHandler(socket, io, activeUser)
    });

    return io;
}

const connectionHandler = (socket, io, activeUser) => {
    socket.on("register", userId => {
       activeUser.set(userId, socket.id);
    });

    privateMessageHandler(socket, io, activeUser);

    socket.on("disconnect", () => {
        for (const [key, value]of activeUser.entries()) {
            if (value === socket.id) {
                activeUser.delete(key);
                break;
            }
        }
    });
}

// digunakan untuk menghanling pengiriman pesan
const privateMessageHandler = ( socket, io, activeUser) => {
    socket.on("private message", data => {
        const {recipientId, message} = data;

        // Mencari Socket Id Penerima
        const recipientSocketId = activeUser.get(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("private message", {
                senderId: socket.id,
                message,
            });
        }else {
            socket.emit("error", {error: `User ${recipientId} is not conneted`});
        }
    });
}

const getIo = ()=> {
    if (!io) {
        throw new Error("Not connected to the server");
    }
    return io;
}

module.exports = {
    initializeSocket,
    getIo,
    activeUser,
};