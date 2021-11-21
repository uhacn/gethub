const Router = require('koa-router');

const momentRouter = new Router({ prefix: '/moment' });


const { create, detail, list, update, remove, addLabel, getPicture } = require('../controller/moment.controller');
const { verifyAuth, verifyPermission } = require('../middleware/auth.middleware');
const { verifyLabelExist } = require('../middleware/label.middle')


// 1. 添加动态
momentRouter.post('/', verifyAuth, create);

// 2. 查询动态
momentRouter.get('/', list);
momentRouter.get('/:momentId', detail);

// 3. 修改动态
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update);

// 4. 删除动态
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove);

// 添加标签
momentRouter.post('/:momentId/label', verifyAuth, verifyPermission, verifyLabelExist, addLabel);

// 获取动态配图
momentRouter.get('/:momentId/picture/:filename', getPicture)

module.exports = momentRouter;