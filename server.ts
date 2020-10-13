import { Message, User } from './types';

const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const { v4: uuidv4 } = require('uuid');
const options = {
  transports: ['websocket'],
};
const socket = require('socket.io')(server, options);
const users: User[] = [];
let messageHistory: Message[] = [];

interface MessageData {
  message: string;
  userId: string;
}

socket.on('connection', (client: any) => {
  let user: User | null = null;

  client.on('signIn', (data: any) => {
    user = {
      name: data.userName,
      id: uuidv4(),
    };
    users.push(user);
    client.emit('signInSuccess', { user, users, messageHistory });
    client.emit('userJoined', user);
    client.broadcast.emit('userJoined', user);
  });

  client.on('newMessage', ({ message, userId }: MessageData) => {
    const messageInfo: Message = { message, userId, id: uuidv4() };
    client.broadcast.emit('newMessage', messageInfo);
    client.emit('newMessage', messageInfo);
    messageHistory.push(messageInfo);
  });

  client.on('disconnect', () => {
    if (user) {
      client.broadcast.emit('userLeft', {
        ...user,
        messageId: uuidv4(),
        message: `${user.name} left the chat`,
      });
      users.splice(users.indexOf(user), 1);
    }

    if (users.length <= 0) {
      messageHistory = [];
    }
  });
});

socket.listen('8080');
