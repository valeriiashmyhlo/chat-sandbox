// @ts-ignore
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
// const router = new Router();
const cors = require('@koa/cors');
const server = require('http').createServer(app.callback());
const { v4: uuidv4 } = require('uuid');
const options = {
  transports: ['websocket'],
};
const socketIO = require('socket.io')(server, options);

app.use(cors()).use(async (ctx: any, res: any) => {
  ctx.body = 'Hello World';
});
// .use(router.routes())

// router.get('/', async (ctx: any, next: any) => {
//   ctx.body = 'Hello World';
//   console.log('lol');
// });

socketIO.on('connection', (socket: any) => {
  socket.on('new message', (message: any) => {
    const messageId = uuidv4();

    socket.broadcast.emit('new message', { ...message, messageId });
    socket.emit('new message', { ...message, messageId });
  });

  socket.on('new user', (data: any) => {
    const { userName } = data;

    socket.emit('new user', {
      userId: uuidv4(),
      userName
    });
  });
});

socketIO.listen('8080');
