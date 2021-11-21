const connection = require('../app/database')

class UserService {
  // 创建用户
  async create(user) {
    const { name, password } = user;
    const statement = `INSERT INTO users (name, password) VALUES (?, ?);`;
    const result = await connection.execute(statement, [name, password])
    return result[0]
  }

  // 获取用户名
  async getUser(name) {
    const statement = `SELECT * FROM users WHERE name = ?; `;
    const result = await connection.execute(statement, [name])
    return result[0]
  }

  async updateAvatarUrl(avatarUrl, userId) {
    const statement = `UPDATE users SET avatar_url = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [avatarUrl, userId]);
    return result;
  }
}

module.exports = new UserService();