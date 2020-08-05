import express, { Request, Response } from "express"
import http from "http"
import socket from "socket.io"
import next from "next"

import {
  Rooms,
  User,
  SendFile,
  AcceptFile,
  PlayLolSound,
  CallUser,
  AcceptCall,
  Message,
  FilterClasses,
} from "./models"

const app = express()

const server = http.createServer(app)

const io = socket(server)

const dev = process.env.NODE_ENV !== "production"
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const PORT = 3000

const rooms: Rooms = {}

io.on("connection", (socket) => {
  const room: string = socket.handshake.query.room
  const username: string = socket.handshake.query.username
  const avatar: string = socket.handshake.query.avatar

  if (rooms[room] && rooms[room].users.length === 2) {
    socket.emit("notAllowed")
    socket.disconnect()
    return
  }

  if (username === "Anonymous") return

  const otherUsername =
    rooms[room] &&
    rooms[room].users &&
    rooms[room].users[0] &&
    rooms[room].users[0].username

  if (username === otherUsername) {
    socket.emit("usernameAlreadyTaken")
    return
  }

  const oldUsers: User[] = (rooms[room] && rooms[room].users) || []
  rooms[room] = {
    users: [...oldUsers, { id: socket.id, username, avatar }],
  }

  socket.join(room)

  socket.broadcast.to(room).emit("userJoinedGlobal")

  io.to(room).emit("listUsers", rooms[room].users)

  io.to(room).emit("chatConnection", "Welcome to Chattr!")

  console.log("USERS", rooms[room].users)

  socket.emit("selfId", socket.id)

  socket.on("otherUserMediaNotSupported", (status: boolean) => {
    socket.broadcast.to(room).emit("otherUserMediaNotSupportedPeer", status)
  })

  socket.on("chatMessage", (msg: Message) => {
    io.to(room).emit("chatMessages", msg)
  })

  socket.on("removeChatTextMessage", (messages: Message[]) => {
    io.to(room).emit("removeChatTextMessageAndUpdateMessages", messages)
  })

  socket.on("messageContainsHeartEmoiji", () => {
    socket.broadcast.to(room).emit("messageContainsHeartEmoijiGlobal")
  })

  socket.on("chatMessageIsTyping", ({ username, status, msg }: Message) => {
    if (msg && msg.length > 1) {
      io.to(room).emit("chatMessageIsTyping", { username, status })
    } else {
      io.to(room).emit("chatMessageIsTyping", { username, status: false })
    }
  })

  socket.on("disconnect", () => {
    rooms[room].users = rooms[room].users.filter(
      (user: User) => user.id !== socket.id
    )

    io.to(room).emit("userLeftChattr")
    io.to(room).emit("listUsers", rooms[room].users)
    socket.leave(room)

    if (!rooms[room].users) {
      delete rooms[room]
    }
  })

  socket.on("callUser", (data: CallUser) => {
    io.to(data.userToCall).emit("call", {
      signal: data.signalData,
      from: data.from,
    })
  })

  socket.on("sendingCall", (data: CallUser) => {
    io.to(data.userToCall).emit("receivingCall")
  })

  socket.on("acceptCall", (data: AcceptCall) => {
    io.to(data.to).emit("callAccepted", data.signal)
  })

  socket.on("cancelCallRequest", () => {
    io.to(room).emit("callCancelled")
  })

  socket.on("sendFile", (data: SendFile) => {
    io.to(data.userToCall).emit("sendingFile", {
      signal: data.signalData,
      from: data.from,
      fileName: data.fileName,
      username: data.username,
    })
  })

  socket.on("acceptFile", (data: AcceptFile) => {
    io.to(data.to).emit("receivingFile", data.signal)
  })

  socket.on("sendImage", (data: any) => {
    io.to(room).emit("getImage", data.toString("base64"))
  })

  socket.on("fileTransferProgress", (progress: string) => {
    io.to(room).emit("fileTransferProgressGlobal", progress)
  })

  socket.on("cancelSendFileRequest", () => {
    io.to(room).emit("sendFileRequestCancelled")
  })

  socket.on("playLolSound", (data: PlayLolSound) => {
    socket.broadcast.to(room).emit("playingLolSound", data.sound)
  })

  socket.on("startGame", (usernameStart) => {
    socket.broadcast.to(room).emit("sendStartGameRequest", usernameStart)
  })

  socket.on("gameBoardUpdated", (board: number[]) => {
    io.to(room).emit("gameBoardUpdatedGlobal", board)
  })

  socket.on("gameNextPlayer", (board: number[]) => {
    io.to(room).emit("gameNextPlayerGlobal", board)
  })

  socket.on("playGameOtherPlayerAccepted", (status: boolean) => {
    io.to(room).emit("playGameOtherPlayerAcceptedGlobal", status)
  })

  socket.on("playGameAssignPlayers", ({ playerX, playerO }) => {
    io.to(room).emit("playGameAssignPlayersGlobal", { playerX, playerO })
  })

  socket.on("peerMutedAudio", (status: boolean) => {
    socket.broadcast.to(room).emit("peerMutedAudio", status)
  })

  socket.on("peerClosedVideo", (status: boolean) => {
    socket.broadcast.to(room).emit("peerClosedVideo", status)
  })

  socket.on("videoFilterClass", (type: FilterClasses) => {
    if (type) {
      socket.broadcast.to(room).emit("videoFilterClassPeer", type)
    } else {
      socket.broadcast.to(room).emit("videoFilterClassPeer", null)
    }
  })

  socket.on("addImageToPhotoGallery", (data: any) => {
    io.to(room).emit("addImageToPhotoGalleryGlobal", data)
  })

  socket.on("sendYoutubeUrl", (data: any) => {
    socket.broadcast.to(room).emit("sendingYoutubeUrl", data)
  })

  socket.on("sendingYoutubeVideoAccepted", (status: boolean) => {
    io.to(room).emit("sendingYoutubeVideoAcceptedGlobal", status)
  })

  socket.on("playYoutubeVideo", (status?: string) => {
    io.to(room).emit("playYoutubeVideoGlobal", status)
  })

  socket.on("sendYoutubeMetaData", (data: Array<any>) => {
    io.to(room).emit("sendYoutubeMetaDataGlobal", data)
  })

  socket.on("rewindYoutubeVideo", () => {
    io.to(room).emit("rewindYoutubeVideoGlobal")
  })

  socket.on("youtubeVideoSeekTo", (time: number, width: number) => {
    io.to(room).emit("youtubeVideoSeekToGlobal", time, width)
  })

  socket.on("sharedScreenRequest", (data) => {
    socket.broadcast.to(room).emit("sharedScreenRequestGlobal", data)
  })

  socket.on("sharedScreenRequestAccepted", (status: boolean) => {
    socket.broadcast.to(room).emit("sharedScreenRequestAcceptedGlobal", status)
  })

  socket.on("flipSelfVideo", (status: boolean) => {
    socket.broadcast.to(room).emit("flipFriendVideo", status)
  })
})

nextApp.prepare().then(() => {
  app.get("*", (req: Request, res: Response) => {
    return nextHandler(req, res)
  })

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
})
