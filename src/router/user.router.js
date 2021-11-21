const Router = require('koa-router');

const { create, getAvatar } = require('../controller/user.controller')
const { verifyUser, passwordHandler } = require('../middleware/user.middleware')

const userRouter = new Router({ prefix: '/users' });

userRouter.post('/', verifyUser, passwordHandler, create);

userRouter.get('/:userId/avatar', getAvatar)


module.exports = userRouter;