const service = require('../service/comment.service')

class CommentController {
  async create(ctx, next) {
    const { content, momentId } = ctx.request.body;
    const { id: userId } = ctx.user;

    const result = await service.create(content, momentId, userId);
    ctx.body = result

  }

  async reply(ctx, next) {
    const { content, momentId } = ctx.request.body;
    const { id: userId } = ctx.user;
    const { commentId } = ctx.params;

    const result = await service.reply(content, momentId, userId, commentId);
    ctx.body = result
  }

  async update(ctx, next) {
    const { commentId } = ctx.params;
    const { content } = ctx.request.body;

    const result = await service.update(commentId, content);
    ctx.body = result
  }

  async remove(ctx, next) {
    const { commentId } = ctx.params;

    const result = await service.remove(commentId);
    ctx.body = result
  }

  async list(ctx, next) {
    const { momentId } = ctx.query;
    console.log(momentId);

    const result = await service.list(momentId);
    ctx.body = result
  }
}

module.exports = new CommentController();