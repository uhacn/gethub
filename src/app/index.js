const koa = require('koa');
const bodyparser = require('koa-bodyparser')


const useRoutes = require('../router/index')
const errorHandler = require('./errorHandler')

const app = new koa();

app.use(bodyparser());

useRoutes(app);

app.on('error', errorHandler);

module.exports = app;