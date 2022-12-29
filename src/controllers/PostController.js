import PostsRepository from "../repositories/PostsRepository.js";
class PostController {
  async index(req, res) {
    const posts = await PostsRepository.findAll();
    return res.status(200).json(posts);
  }
}
export default new PostController();
