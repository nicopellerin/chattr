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
  socket.join(room)

  const sockets = io.in(room)
  Object.keys(sockets.sockets).forEach((user) => {
    users[socket.id] = sockets.sockets[user].id
    console.log("user", sockets.sockets[user].id)
  })

  if (io.sockets.adapter.rooms[room].length === 3) {
    socket.disconnect()
  }

  socket.emit("selfId", socket.id)

  io.emit("listUsers", users)

  io.to(room).emit("chatConnection", "Welcome to Chattr!")

  socket.on("chatMessage", (msg) => {
    io.to(room).emit("chatMessages", msg)
  })

  socket.on("disconnect", () => {
    delete users[socket.id]
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
