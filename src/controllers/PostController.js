import PostsRepository from "../repositories/PostsRepository.js";
class PostController {
  async index(req, res) {
    const posts = await PostsRepository.findAll();
    return res.status(200).json(posts);
  }
  async show(req, res) {
    const { id } = request.params;
    const post = await PostsRepository.findByPostId(id);
    return res.status(200).json(post);
  }
  async lastPost(req, res) {
    const last_post = await PostsRepository.findLastPost();
    return res.status(200).json(last_post);
  }
}
export default new PostController();
