import express from "express";
import http from "http";
import socket from "socket.io";
import next from "next";
const app = express();
const server = http.createServer(app);
const io = socket(server);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const PORT = process.env.PORT || 3000;
const rooms = {};
io.on("connection", (socket) => {
    const room = socket.handshake.query.room;
    // io.in(room).clients((error, clients) => {
    //   if (error) {
    //     throw error
    //   }
    //   // if (clients.length > 2) {
    //   //   console.log("MAX CONNECTIONS0")
    //   //   return
    //   // }
    // })
    socket.join(room);
    const oldUsers = (rooms[room] && rooms[room].users) || [];
    rooms[room] = { users: [...oldUsers, socket.id] };
    io.to(room).emit("listUsers", rooms[room].users);
    io.to(room).emit("userJoinedChattr");
    socket.emit("selfId", socket.id);
    io.to(room).emit("chatConnection", "Welcome to Chattr!");
    socket.on("chatMessage", (msg) => {
        io.to(room).emit("chatMessages", msg);
    });
    socket.on("chatMessageIsTyping", ({ username, status, msg }) => {
        if (msg && msg.length > 1) {
            io.to(room).emit("chatMessageIsTyping", { username, status });
        }
        else {
            io.to(room).emit("chatMessageIsTyping", { username, status: false });
        }
    });
    socket.on("disconnect", () => {
        rooms[room].users = rooms[room].users.filter((user) => user !== socket.id);
        io.to(room).emit("userLeftChattr", "Your friend left Chattr");
        io.emit("listUsers", []);
        socket.leave(room);
    });
    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("call", {
            signal: data.signalData,
            from: data.from,
        });
    });
    socket.on("acceptCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });
    socket.on("cancelCallRequest", () => {
        io.to(room).emit("callCancelled");
    });
});
nextApp.prepare().then(() => {
    app.get("*", (req, res) => {
        return nextHandler(req, res);
    });
    server.listen(PORT, (err) => {
        if (err)
            throw err;
        console.log(`Listening on port ${PORT}`);
    });
});
