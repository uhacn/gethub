const jwt = require('jsonwebtoken')

const errorType = require('../constants/errorType');
const userService = require('../service/user.service')
const authService = require('../service/auth.service')
const md5password = require('../utils/passwordHandler')
const { PUBLIC_KEY } = require('../app/config')

const verifyLogin = async (ctx, next) => {
  // 1.获取用户名和密码
  const { name, password } = ctx.request.body;

  // 2.判断用户名或者密码不能空
  if (!name || !password) {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit('error', error, ctx)
  }

  // 3.判断用户是否存在
  const result = await userService.getUser(name);
  const user = result[0];
  if (!user) {
    const error = new Error(errorType.USER_DOES_NOT_EXISTS);
    return ctx.app.emit('error', error, ctx)
  }
  
  // 4.判断请求密码和数据库中的密码是否一致(加密后)
  if (md5password(password) !== user.password) {
    const error = new Error(errorType.PASSWORD_IS_INCORRECT);
    return ctx.app.emit('error', error, ctx)
  }
  ctx.user = user;
  await next()
}

const verifyAuth = async (ctx, next) => {
  // 1.获取token
  const authorization = ctx.request.headers.authorization;
  if (!authorization) {
    const error = new Error(errorType.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx)
  }
  const token = authorization.substr(7)
  // 2.验证token(id/name/iat/exp)
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    });
    ctx.user = result;
    await next()
  } catch (err) {
    // console.log(err); 
    const error = new Error(errorType.UNAUTHORIZATION);
    ctx.app.emit('error', error, ctx)
  }
}

const verifyPermission = async (ctx, next) => {
  // 1. 获取动态id和用户id
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace('Id', '');
  const id = ctx.params[resourceKey];
  const { id: userId } = ctx.user;

  // 2.查询是否具备权限
  try {
    const isPermission = await authService.checkPermission(tableName, id, userId)
    if (!isPermission) throw new Error();

    await next()
  } catch (err) {
    const error = new Error(errorType.UNPERMISSION)
    return ctx.app.emit('error', error, ctx) 
  }

}

module.exports = { verifyLogin, verifyAuth, verifyPermission }