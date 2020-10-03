import { Message, User } from './types';

const Koa = require('koa');
const app = new Koa();
const cors = require('@koa/cors');
const server = require('http').createServer(app.callback());
const { v4: uuidv4 } = require('uuid');
const options = {
  transports: ['websocket'],
};
const socketIO = require('socket.io')(server, options);
const msgHistory: Message[] = [];
let user: User | null = null;

app.use(cors()).use(async (ctx: any, res: any) => {
  ctx.body = 'Hello World';
});

socketIO.on('connection', (socket: any) => {
  socket.on('new message', (message: Message) => {
    const messageId = uuidv4();
    const messageInfo = { ...message, messageId };

    socket.broadcast.emit('new message', messageInfo);
    socket.emit('new message', messageInfo);
    msgHistory.push(messageInfo);
  });

  socket.on('new user', (data: any) => {
    user = {
      userName: data.userName,
      userId: uuidv4()
    }
    const userJoinMsg = {
      ...user,
      messageId: uuidv4(),
      message: `${user.userName} joined the chat`
    };

    socket.emit('new user', user);
    socket.broadcast.emit('user joined', userJoinMsg);
    socket.emit('user joined', userJoinMsg);
    socket.emit('msgHistory', msgHistory);
  });

  socket.on('disconnect', () => {
    if (user) {
      socket.broadcast.emit('user left', {
        ...user,
        messageId: uuidv4(),
        message: `${user.userName} left the chat`
      });
    }
  });
});

socketIO.listen('8080');
