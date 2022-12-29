import db from "../database/index.js";

class PostsRepository {
  async findLastPost() {
    const [row] = await db.query(
      "SELECT * FROM POSTS ORDER BY post_id DESC LIMIT 1"
    );
    return row;
  }
  async findAll() {
    const row = await db.query("SELECT * FROM posts ORDER BY post_id");
    return row;
  }
  async createPost(payload) {
    const {
      title,
      subject,
      subject_url,
      teacher,
      comments,
      post_id,
      post_url,
    } = payload;
    const [post] = await db.query({
      text: `
      INSERT INTO posts (title, subject, subject_url, teacher, comments, post_id, post_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `,
      values: [
        title,
        subject,
        subject_url,
        teacher,
        comments,
        post_id,
        post_url,
      ],
    });
    return post;
  }
}

export default new PostsRepository();
