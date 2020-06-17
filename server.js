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

let chatMessages = []

io.on("connection", (socket) => {
  const room = socket.handshake.query.room
  console.log("ROOM", room)
  // socket.join(room)

  // const sockets = nsp.in(room)
  // Object.keys(sockets.sockets).forEach((user) => {
  //   users[socket.id] = sockets.sockets[user].id
  //   nsp.to(room).emit("listUsers", users[socket.id])
  // })

  if (!users[socket.id]) {
    users[socket.id] = socket.id
  }

  // if (io.sockets.adapter.rooms[room].length === 3) {
  //   socket.disconnect()
  // }
  socket.emit("selfId", socket.id)

  io.emit("listUsers", users)

  io.to(room).emit("chatConnection", "Welcome to Chattr!")

  socket.to(room).on("chatMessage", (msg) => {
    chatMessages.push(msg)

    io.to(room).emit("chatMessages", chatMessages)
  })

  socket.on("disconnect", () => {
    delete users[socket.id]
    socket.disconnect()
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
