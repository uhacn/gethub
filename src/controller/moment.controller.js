const fs = require('fs')

const momentRouter = require('../router/moment.router');
const authService = require('../service/auth.service');
const momentService = require('../service/moment.service');
const service = require('../service/moment.service')

const { PICTURE_PATH } = require('../constants/filePath')

class MomentController {
  async create(ctx, body) {
    // 1.获取数据(user_id, content)
    const { id } = ctx.user;
    const { content } = ctx.request.body;

    // 2.将数据插入到数据库
    const result = await service.create(content, id)
    ctx.body = result
  }

  async detail(ctx, next) {
    const momentId = ctx.params.momentId;
    const result = await service.getMoment(momentId);
    ctx.body = result
  }

  async list(ctx, next) {
    const { offset, size } = ctx.query;
    const result = await service.getMomentList(offset, size);
    ctx.body = result;
  }

  async update(ctx, next) {
    // 1. 获取动态id和要修改的内容
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;

    // 2. 修改内容
    const result = await momentService.update(content, momentId);
    ctx.body = result
  }

  async remove(ctx, next) {
    // 1. 获取要删除的动态的id
    const { momentId } = ctx.params;

    // 2. 修改内容
    const result = await momentService.remove(momentId);
    ctx.body = result
  }

  async addLabel(ctx, next) {
    // 1. 获取所有标签和动态id
    const { labels } = ctx;
    const { momentId } = ctx.params

    //  2. 判断标签是否已经存在
    for (let label of labels) {
      const isExists = await momentService.isExist(momentId, label.id);
      if (!isExists) {
        await momentService.addLabel(momentId, label.id)
      }
    }
    ctx.body = '添加标签成功'
  }

  async getPicture(ctx, next) {
 try {
  let { momentId,filename } = ctx.params;
  const pictureInfo = await momentService.getPicture(filename, momentId);
  
  // 判断是否传有图片大小类型
  const { size } = ctx.query;
  const sizes = ['large', 'middle', 'small'];
  if (sizes.some(item => item == size)) {
    filename = filename + '-' + size;
  }
  
  // 设置响应类型 并将图片流放进响应体
  ctx.response.set('content-type', pictureInfo.mimetype);
  ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
 } catch (error) {
   console.log(error);
 }
  }


}

module.exports = new MomentController();


