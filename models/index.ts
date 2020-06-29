export interface User {
  id: string
  username: string
}

export interface Message {
  username: string
  status: string
  msg: string
}

export interface Call {
  signal: any
  from: string
}

export interface CallUser {
  userToCall: string
  signalData: any
  from: string
}

export interface AcceptCall {
  to: string
  signal: any
}

export interface Rooms {
  [room: string]: {
    users: User[]
  }
}

export interface SendFile {
  userToCall: string
  signalData: any
  from: string
  fileName: string
  username: string
}

export interface AcceptFile {
  to: string
  signal: any
}

export interface PlayLolSound {
  to: string
  sound: string
}
