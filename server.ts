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
    const userJoinedMessage = {
      userId: user.id,
      id: uuidv4(),
      message: `${user.name} joined the chat`,
      isUserMsg: true,
    };

    users.push(user);
    messageHistory.push(userJoinedMessage);

    client.emit('signInSuccess', { user, users, messageHistory });
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
      const userLeftMessage = {
        userId: user.id,
        id: uuidv4(),
        message: `${user.name} joined the chat`,
        isUserMsg: true,
      };

      client.broadcast.emit('userLeft', { user, userLeftMessage });
      users.splice(users.indexOf(user), 1);
    }

    if (users.length <= 0) {
      messageHistory = [];
    }
  });
});

socket.listen('8080');
