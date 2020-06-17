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

// const users = {}

let chatMessages = []

const nsp = io.of("/")

nsp.on("connection", (socket) => {
  const room = socket.handshake.query.room
  console.log("ROOM", room)
  socket.join(room)

  const sockets = nsp.in(room)
  Object.keys(sockets.sockets).forEach((user) => {
    // users[socket.id] = sockets.sockets[user].id
    nsp.to(room).emit("listUsers", sockets.sockets[user].id)
  })

  if (io.sockets.adapter.rooms[room].length === 3) {
    socket.disconnect()
  }

  nsp.to(room).emit("chatConnection", "Welcome to Chattr!")

  socket.to(room).on("chatMessage", (msg) => {
    chatMessages.push(msg)

    nsp.to(room).emit("chatMessages", chatMessages)
  })

  socket.to(room).emit("selfId", socket.id)

  socket.on("disconnect", () => {
    // delete users[socket.id]
    chatMessages = []
  })

  socket.to(room).on("callUser", (data) => {
    nsp.to(data.userToCall).emit("call", {
      signal: data.signalData,
      from: data.from,
    })
  })

  socket.to(room).on("acceptCall", (data) => {
    nsp.to(data.to).emit("callAccepted", data.signal)
  })
})

nextApp.prepare().then(() => {
  // app.get("/test", (req, res) => {
  //   return nextHandler(req, res)
  // })

  app.get("*", (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Listening on port ${PORT}`)
  })
})
