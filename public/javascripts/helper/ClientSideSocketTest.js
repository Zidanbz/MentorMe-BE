const socket = io("http://localhost:3000");

// Daftarkan pengguna (userId bisa berasal dari login)
socket.emit("register", "userA");

// Kirim pesan pribadi
socket.emit("private message", {
    recipientId: "userB",
    message: "Hello, User B!",
});

// Terima pesan pribadi
socket.on("private message", (data) => {
    console.log(`Message from ${data.senderId}: ${data.message}`);
});

// Error handling
socket.on("error", (err) => {
    console.error("Error:", err.error);
});
