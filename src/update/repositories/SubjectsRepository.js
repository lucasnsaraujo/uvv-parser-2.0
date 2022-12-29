import db from "../../database/index.js";

class SubjectsRepository {
  async findAll() {
    const row = await db.query({
      text: `SELECT * FROM subjects`,
    });
    return row;
  }
  async findById(id) {
    const [row] = await db.query({
      text: `SELECT * FROM subjects
      WHERE id = $1`,
      values: id,
    });
    return row;
  }
  async createSubject(name, teacher_id) {
    const [row] = await db.query({
      text: `INSERT INTO subjects (name, teacher_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      values: [name, teacher_id],
    });
    return row;
  }
}

export default new SubjectsRepository();
