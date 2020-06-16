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

const chatMessages = []

io.on("connection", (socket) => {
  if (!users[socket.id]) {
    users[socket.id] = socket.id
  }

  socket.emit("chatConnection", "Welcome to Chattr!")

  socket.on("chatMessage", (msg) => {
    chatMessages.push(msg)

    io.emit("chatMessages", chatMessages)
  })

  socket.on("username", (username) => {
    users[socket.id] = username
  })

  socket.emit("selfId", socket.id)
  io.sockets.emit("listUsers", users)
  socket.on("disconnect", () => {
    delete users[socket.id]
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
