import PostsRepository from "../repositories/PostsRepository.js";
import TeachersRepository from "../repositories/TeachersRepository.js";
import SubjectsRepository from "../repositories/SubjectsRepository.js";

class PostController {
  async index(request, response) {
    const items = await PostsRepository.findAll();
    return response.status(200).json(items);
  }
  async store(request, response) {
    const { post_number, subject_id, teacher_id, title, content, comments } =
      request;
    const hasTeacher = await TeachersRepository.findById(teacher_id);
    if (!hasTeacher) {
      response.status(400).json({ error: "Teacher does not exist" });
    }
    const hasSubject = await SubjectsRepository.findById(subject_id);
    if (!hasSubject) {
      return response.status(400).json({ error: "Subject does not exist" });
    }

    const user = await PostsRepository.createPost({
      post_number,
      subject_id,
      teacher_id,
      title,
      content,
      comments,
    });
    return response.status(200).json(user);
  }
}

export default new PostController();
