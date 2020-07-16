export interface User {
  id: string
  username: string
  avatar: string
}

export interface OgData {
  title: string
  desc: string
  image: string
}

export interface Message {
  id: string
  username: string
  avatar: string
  status: boolean
  msg: string
  filename?: string
  ogData: OgData
  type: string
}

export interface PhotoGallery {
  id: string
  username: string
  avatar: string
  msg: string
  filename?: string
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
