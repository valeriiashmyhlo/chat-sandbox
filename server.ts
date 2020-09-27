// @ts-ignore
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const server = require('http').createServer(app.callback());
const { v4: uuidv4 } = require('uuid');
const allowedOrigins = 'http://localhost:* http://192.168.1.102:*';
const options = {
  transports: ['websocket'],
};
const socketIO = require('socket.io')(server, options);

app.use(cors()).use(async (ctx: any, res: any) => {
  ctx.body = 'Hello World';
});
// .use(router.routes())
// .use(router.allowedMethods())
// .use(bodyParser());

// router.get('/', async (ctx: any, next: any) => {
//   ctx.body = 'Hello World';
//   console.log('lol');
// });

socketIO.on('connection', (socket: any) => {
  socket.on('new message', (data: any) => {
    socket.broadcast.emit('new message', {
      id: uuidv4(),
      message: data,
    });

    socket.emit('new message', {
      id: uuidv4(),
      message: data,
    });
  });

  socket.on('new user', (data: any) => {
    const { username } = data;

    socket.emit('new user', {
      id: uuidv4(),
      username,
    });
  });
});

socketIO.listen('8080');
