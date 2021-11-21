const app = require('./app/index');
const config = require('./app/config');
require('./app/database')

app.listen(config.APP_PORT, () => {
  console.log(`${config.APP_PORT}端口服务器启动成功~`);
})
