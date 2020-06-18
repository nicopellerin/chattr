const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const socket = require("socket.io")
const io = socket(server)
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const PORT = 3000

const users = {}

io.on("connection", (socket) => {
  const room = socket.handshake.query.room

  if (
    io.sockets.adapter.rooms[room] &&
    io.sockets.adapter.rooms[room].length === 2
  ) {
    socket.disconnect()
  } else {
    socket.join(room)
  }

  const sockets = io.in(room)
  Object.keys(sockets.sockets).forEach((user) => {
    if (!users[sockets.sockets[user].id]) {
      users[socket.id] = sockets.sockets[user].id
    }
  })
  console.log("USERS", users)

  io.to(room).emit("userJoinedChattr")

  socket.emit("selfId", socket.id)

  io.emit("listUsers", users)

  io.to(room).emit("chatConnection", "Welcome to Chattr!")

  socket.on("chatMessage", (msg) => {
    io.to(room).emit("chatMessages", msg)
  })

  socket.on("chatMessageIsTyping", ({ username, status, msg }) => {
    if (msg && msg.length > 1) {
      io.to(room).emit("chatMessageIsTyping", { username, status })
    } else {
      io.to(room).emit("chatMessageIsTyping", { username, status: false })
    }
  })

  socket.on("disconnect", () => {
    delete users[socket.id]
    io.to(room).emit("userLeftChattr", "Your friend left Chattr")
    socket.leave(room)
  })

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("call", {
      signal: data.signalData,
      from: data.from,
    })
  })

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  })
})

nextApp.prepare().then(() => {
  app.get("*", (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Listening on port ${PORT}`)
  })
})
