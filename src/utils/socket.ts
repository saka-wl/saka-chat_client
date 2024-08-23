
import { io, Socket } from "socket.io-client"
import { socketFriendChatUrl } from "../constant/request";

export const socket: Socket = io(socketFriendChatUrl);