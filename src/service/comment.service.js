const connection = require('../app/database')

class CommentService {
  async create(content, momentId, userId) {
    const statement = `INSERT INTO comment (content, moment_id, user_id) VALUES (?, ?, ?)`;
    const [result] = await connection.execute(statement, [content, momentId, userId])
    return result
  }

  async reply(content, momentId, userId, commentId) {
    const statement = `INSERT INTO comment (content, moment_id, user_id, comment_id) VALUES (?, ?, ?, ?)`;
    const [result] = await connection.execute(statement, [content, momentId, userId, commentId])
    return result
  }

  async update(commentId, content) {
    const statement = `UPDATE comment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, commentId]);
    return result
  }

  async remove(commentId) {
    const statement = `DELETE FROM comment WHERE id = ?;`;
    const [result] = await connection.execute(statement, [commentId]);
    return result
  }

  async list(momentId) {
    const statement = `
    SELECT c.id, c.content, c.moment_id momentId, c.comment_id   commentId,
       JSON_OBJECT('id', u.id, 'name', u.name) user
    FROM comment c
    LEFT JOIN users u ON u.id = c.user_id
    WHERE moment_id = 1;
    `;
    const [result] = await connection.execute(statement, [momentId]);
    return result
  }
}

module.exports = new CommentService()