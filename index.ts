import express, { Request, Response } from "express"
import http from "http"
import socket from "socket.io"
import next from "next"

const app = express()
const server = http.createServer(app)

const io = socket(server)

const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const PORT = 3000

interface Rooms {
  [room: string]: {
    users: string[]
  }
}

const rooms: Rooms = {}

io.on("connection", (socket) => {
  const room: string = socket.handshake.query.room

  if (rooms[room] && rooms[room].users.length === 2) {
    socket.emit("notAllowed")
    socket.disconnect()
    return
  }
  socket.join(room)

  const oldUsers: string[] = (rooms[room] && rooms[room].users) || []
  rooms[room] = { users: [...oldUsers, socket.id] }

  console.log(rooms[room].users)

  io.to(room).emit("listUsers", rooms[room].users)
  io.to(room).emit("userJoinedChattr")
  io.to(room).emit("chatConnection", "Welcome to Chattr!")

  socket.emit("selfId", socket.id)

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
    rooms[room].users = rooms[room].users.filter(
      (user: string) => user !== socket.id
    )
    io.to(room).emit("userLeftChattr", "Your friend left Chattr")
    io.emit("listUsers", rooms[room].users)
    socket.leave(room)
  })

  socket.on("callUser", (data: any) => {
    io.to(data.userToCall).emit("call", {
      signal: data.signalData,
      from: data.from,
    })
  })

  socket.on("acceptCall", (data: any) => {
    io.to(data.to).emit("callAccepted", data.signal)
  })

  socket.on("cancelCallRequest", () => {
    io.to(room).emit("callCancelled")
  })

  socket.on("sendFile", (data: any) => {
    io.to(data.userToCall).emit("sendingFile", {
      signal: data.signalData,
      from: data.from,
      fileName: data.fileName,
    })
  })

  socket.on("acceptFile", (data: any) => {
    io.to(data.to).emit("receivingFile", data.signal)
  })
})

nextApp.prepare().then(() => {
  app.get("*", (req: Request, res: Response) => {
    return nextHandler(req, res)
  })

  server.listen(PORT, (err?: any) => {
    if (err) throw err
    console.log(`Listening on port ${PORT}`)
  })
})
