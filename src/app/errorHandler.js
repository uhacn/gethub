const errorType = require('../constants/errorType')

const errorHandler = (err, ctx) => {
  let status, message;
  switch (err.message) {
    case errorType.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400;
      message = '用户名或者密码为空';
      break;
    case errorType.USERNAME_ALREADY_EXISTS:
      status = 409; // conflict
      message = "用户名已经存在";
      break;
    case errorType.USER_DOES_NOT_EXISTS:
      status = 400;
      message = "用户不存在";
      break;
    case errorType.PASSWORD_IS_INCORRECT:
      status = 400;
      message = "密码不正确";
      break;
    case errorType.UNAUTHORIZATION:
      status = 401;
      message = "未授权";
      break;
    case errorType.UNPERMISSION:
      status = 401;
      message = "您没有权限修改";
      break;
    default:
      status = 400;
      message = '发生错误'
  }
  ctx.status = status;
  ctx.body = message
}

module.exports = errorHandler