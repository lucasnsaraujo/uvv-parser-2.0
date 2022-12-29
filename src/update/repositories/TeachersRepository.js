import db from "../../database/index.js";

class TeachersRepository {
  async createTeacher(payload) {
    const { name } = payload;
    const [row] = await db.query({
      text: `INSERT INTO teachers (name)
      VALUES ($1)
      RETURNING *
      `,
      values: [name],
    });
    return row;
  }
  async findById(id) {
    const [row] = await db.query({
      text: `SELECT * FROM teachers
      WHERE id = $1`,
      values: id,
    });
    return row;
  }
  async findAll() {
    const row = await db.query({
      text: `SELECT * FROM teachers`,
    });
    return row;
  }
}

export default new TeachersRepository();
