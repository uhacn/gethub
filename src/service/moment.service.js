const connection = require('../app/database')

class MomentService {
  async create(content, user_id) {
    const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?); `;
    const result = await connection.execute(statement, [content, user_id])
    return result[0]
  }

  async getMoment(momentId) {
    const statement = `
    SELECT 
    m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
    JSON_OBJECT('id', u.id, 'name', u.name, 'avatar', u.avatar_url) users,
    IF(COUNT(c.id),JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'content', c.content, 'commmentId', c.comment_id,'user',
       JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatar', cu.avatar_url))) ,
        NULL) comments,
    (SELECT IF(l.id, JSON_ARRAYAGG(JSON_OBJECT('id', l.id,
      'name', l.name)), NULL) FROM moment_label ml LEFT JOIN label l  ON ml.label_id = l.id 
       WHERE m.id = ml.moment_id) labels,
    (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/', m.id, '/picture/',p.filename)) FROM picture p WHERE m.id = p.moment_id) images
    FROM moment m
    LEFT JOIN users u ON u.id = m.user_id
    LEFT JOIN comment c ON c.moment_id = m.id
    LEFT JOIN users cu ON cu.id = c.user_id
    WHERE m.id = ?;
    `;
    const [result] = await connection.execute(statement, [momentId])
    return result[0]
  }

  async getMomentList(offset, size) {
    const statement = `
    SELECT 
      m.id id, m.content content, m.createAt createTime,
      m.updateAt updateTime,
      JSON_OBJECT('id', u.id, 'name', u.name) users,
      (SELECT COUNT(*) FROM comment WHERE m.id = comment.moment_id) commentCount,
      (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
      (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/', m.id, '/picture/',p.filename)) FROM picture p WHERE m.id = p.moment_id) images
    FROM moment m
    LEFT JOIN users u ON u.id = m.user_id
    LIMIT ?, ?;
    `;
    const [result] = await connection.execute(statement, [offset, size])
    return result
  }

  async update(content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, momentId])
    return result
  }

  async remove(momentId) {
    const statement = `DELETE FROM moment WHERE id = ?;`;
    const [result] = await connection.execute(statement, [momentId])
    return result
  }

  async isExist(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result[0] ? true : false;
  }

  async addLabel(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }

  async getPicture(filename, momentId) {
    const statement = `SELECT * FROM picture WHERE filename = ? AND moment_id = ?;`;
    const [result] = await connection.execute(statement, [filename, momentId]);
    return result[0]
  }

}



module.exports = new MomentService();

