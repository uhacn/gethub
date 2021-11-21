const service = require('../service/label.service')

const verifyLabelExist = async (ctx, next) => {
  // 1. 获取要添加的标签
  const { labels } = ctx.request.body;

  // 2. 判断标签是否已经存在
  const newLabels = [];
  for (let labelName of labels) {
    const getLabel = await service.getLabel(labelName);
    const label = { labelName };
    // 如果不存在则创建标签
    if (!getLabel) {
      const result = await service.create(labelName);
      label.id = result.insertId
    } else {
      label.id = getLabel.id
    }

    newLabels.push(label)
  }
  // 将所有标签添加进ctx
  ctx.labels = newLabels;

  await next()
}

module.exports = { verifyLabelExist }