const fileService = require('../service/file.service');
const userService = require('../service/user.service');
const { AVATAR_PATH } = require('../constants/filePath');
const { APP_HOST, APP_PORT } = require('../app/config')


class FileController {
  async createAvatar(ctx, next) {
    const { filename, mimetype, size } = ctx.req.file;
    const { id } = ctx.user;

    await fileService.createAvatar(filename, mimetype, size, id);

    // 更新头像地址
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`
    await userService.updateAvatarUrl(avatarUrl, id)

    ctx.body = '上传头像成功';
  }

  async createPicture(ctx, next) {
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { momentId } = ctx.params;

    // 遍历所有图片并上传
    for (let file of files) {
      const { filename, mimetype, size } = file;
      await fileService.createPicture(filename, mimetype, size, id, momentId)
    }

    ctx.body = '上传动态配图成功';
  }
}

module.exports = new FileController()

