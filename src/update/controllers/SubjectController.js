import SubjectsRepository from "../repositories/SubjectsRepository.js";

class SubjectController {
  async index(request, response) {
    const subjects = await SubjectsRepository.findAll();
    return response.status(200).json(subjects);
  }
  async show(request, response) {
    const id = request.params;
    const subject = await SubjectsRepository.findById(id);
    return response.status(200).json(subject);
  }
  async store(request, response) {
    const { name, teacher_id } = request.body;
    const subject = await SubjectsRepository.createSubject(name, teacher_id);
    return response.status(200).json(subject);
  }
}
export default new SubjectController();
