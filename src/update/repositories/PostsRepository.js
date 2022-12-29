import db from "../../database/index.js";
class PostsRepository {
  async findAll() {
    const row = await db.query({
      text: `SELECT * FROM posts`,
    });
    return row;
  }
  async findById(id) {
    const [row] = await db.query({
      text: `SELECT * FROM posts
      WHERE id = $1`,
      values: id,
    });
    return row;
  }
  async createPost(payload) {
    const { post_number, subject_id, teacher_id, title, content, comments } =
      payload;
    const row = await db.query({
      text: `
      INSERT INTO posts (post_number, subject_id, teacher_id, title, content, comments)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      values: [post_number, subject_id, teacher_id, title, content, comments],
    });
    return row;
  }
}

export default new PostsRepository();
