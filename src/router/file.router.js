const Router = require('koa-router');


const { verifyAuth } = require('../middleware/auth.middleware');
const { avatarHandler, pictureHandler, pictureResize } = require('../middleware/file.middleware');
const { createAvatar, createPicture } = require('../controller/file.controller');


const fileRouter = new Router({ prefix: '/upload' });



fileRouter.post('/avatar', verifyAuth, avatarHandler, createAvatar);
fileRouter.post('/picture/:momentId', verifyAuth, pictureHandler, pictureResize, createPicture );

module.exports = fileRouter; 