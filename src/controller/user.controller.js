const fs = require('fs')

const userService = require('../service/user.service')
const fileService = require('../service/file.service')
const { AVATAR_PATH } = require('../constants/filePath.js')

class UserController {
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body;
    // 查询数据
    const result = await userService.create(user);
    // 返回数据
    ctx.body = result;
  }

  async getAvatar(ctx, next) {
    const { userId } = ctx.params;

    const result = await fileService.getAvatar(userId);
    // 设置响应的类型
    ctx.response.set('content-type', result.mimetype)
    // 将头像数据放进响应体
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${result.filename}`)
  }
}

module.exports = new UserController();