const path = require('path')

const Multer = require('koa-multer');
const Jimp = require('jimp')

const { AVATAR_PATH, PICTURE_PATH } = require('../constants/filePath')




const avatarUpload = Multer({
  dest: AVATAR_PATH
})

const avatarHandler = avatarUpload.single('avatar');


const pictureUpload = Multer({
  dest: PICTURE_PATH
})

const pictureHandler = pictureUpload.array('picture', 9);

const pictureResize = async (ctx, next) => {
  const files = ctx.req.files;
  for (let file of files) {
    const picPath = path.join(file.destination, file.filename);
    Jimp.read(file.path).then(image => {
      image.resize(1280, Jimp.AUTO).write(`${picPath}-large`);
      image.resize(640, Jimp.AUTO).write(`${picPath}-middle`);
      image.resize(320, Jimp.AUTO).write(`${picPath}-small`);
    })
  }
  await next()
}


module.exports = { avatarHandler, pictureHandler, pictureResize }

